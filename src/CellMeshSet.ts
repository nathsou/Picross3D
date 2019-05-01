import { BufferAttribute, BufferGeometry, Material, Mesh, Object3D, Raycaster, Face3 } from "three";
import { Array3D } from "./Utils/Array3D";
import { CellSetRenderer } from "./CellSetRenderer";
import { LineRange } from "./UI/LineHandleManager";
import { CellState, LineDirection, PicrossShape } from "./PicrossShape";
import EventEmitter from "./Utils/EventEmitter";

export class CellMeshSet extends EventEmitter {

    private cells: Array3D<Mesh>;
    private shape: PicrossShape;
    private raycastables: Object3D[];
    private renderer: CellSetRenderer;
    private needs_normals: boolean;
    private cells_to_update: Set<number>;
    private placed_cells_state: CellState;

    private static face_vertices: number[][] = [
        [0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1], //front
        [0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1], //top
        [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1], //left
        [0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0], //bottom
        [1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0], //back
        [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0] //right
    ];

    private static face_normals: number[][] = [
        [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], //front
        [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], //top
        [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0], //left
        [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0], //bottom
        [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1], //back
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] //right
    ];

    constructor(
        shape: PicrossShape,
        cell_renderer: CellSetRenderer,
        needs_normals = false,
        placed_cells_state = CellState.unknown
    ) {
        super();
        this.shape = shape;
        this.raycastables = [];
        this.renderer = cell_renderer;
        this.needs_normals = needs_normals;
        this.cells_to_update = new Set<number>();
        this.placed_cells_state = placed_cells_state;
    }

    public generateMeshes(): void {

        this.cells = new Array3D([], this.shape.dims);

        // generate cells
        for (let i = 0; i < this.shape.dims[0]; i++) {
            for (let j = 0; j < this.shape.dims[1]; j++) {
                for (let k = 0; k < this.shape.dims[2]; k++) {
                    this.addToQueue(i, j, k);
                }
            }
        }

        this.clearQueue();
    }

    // executing updateCell() in order generates a lot of meshes which are not visible in the end
    // when a selection of multiple cells is made
    // queuing the calls makes cellVisible() accurate
    public addToQueue(i: number, j: number, k: number): void {
        this.cells_to_update.add(this.cells.idx(i, j, k));
    }

    private clearQueue(): void {
        for (const cell of this.cells_to_update) {
            const coords = this.cells.idxToCoords(cell);
            this.updateCell(coords[0], coords[1], coords[2]);
        }

        this.cells_to_update.clear();
    }

    //FIXME: remove
    public updateAllCells(): void {
        for (let i = 0; i < this.shape.dims[0]; i++) {
            for (let j = 0; j < this.shape.dims[1]; j++) {
                for (let k = 0; k < this.shape.dims[2]; k++) {
                    this.addToQueue(i, j, k);
                }
            }
        }

        this.clearQueue();
    }

    private updateCell(i: number, j: number, k: number): void {

        if (!this.cellVisible(i, j, k)) return;

        const visible_faces = this.visibleFaces(i, j, k);

        // if there is no visible face
        if (!visible_faces.some(face => face)) return;

        let mesh: Mesh = this.cells.at(i, j, k);

        if (mesh !== undefined) {
            (mesh.geometry as BufferGeometry).clearGroups();
            // empty materials
            (mesh.material as Material[]).length = 0;
            mesh.visible = true;
        } else { // create new mesh
            mesh = new Mesh();
            mesh.geometry = new BufferGeometry();
            mesh.material = [];
            mesh.position.set(i, j, k);
            this.renderer.addCell(mesh);
            this.raycastables.push(mesh);
            this.cells.set(i, j, k, mesh);
        }

        const geo = mesh.geometry as BufferGeometry;
        const materials = mesh.material as Material[];
        const vertices = [];
        const uvs = [];
        const normals = [];
        const indices = [];
        const face_materials = this.renderer.getCellMaterials(i, j, k, this.shape.getCell(i, j, k));

        for (let i = 0, n = 0; i < 6; i++) {
            if (visible_faces[i]) {
                geo.addGroup(vertices.length / 2, 6, materials.length);
                materials.push(face_materials[i]);

                vertices.push(...CellMeshSet.face_vertices[i]);
                if (this.needs_normals) {
                    normals.push(...CellMeshSet.face_normals[i]);
                }
                indices.push(n, n + 2, n + 1, n + 2, n + 3, n + 1);
                uvs.push(0, 1, 1, 1, 0, 0, 1, 0);
                n += 4;
            }
        }

        geo.addAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
        geo.addAttribute('uv', new BufferAttribute(new Uint8Array(uvs), 2));
        geo.setIndex(new BufferAttribute(new Uint8Array(indices), 1));
        if (this.needs_normals) {
            geo.addAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
        }
    }

    public clear(): void {
        for (const cell of this.raycastables) {
            this.renderer.removeObject3D(cell);
        }

        this.cells.clear();
    }

    public rayCast(raycaster: Raycaster, builder: boolean): { pos: number[], face: Face3 } {
        // this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersections = raycaster.intersectObjects(this.raycastables);

        for (const inter of intersections) {

            const pos = inter.object.position;

            if (this.cells.at(pos.x, pos.y, pos.z) !== undefined) {
                if (!builder) {
                    return {
                        pos: pos.toArray(),
                        face: inter.face
                    };
                } else {
                    return {
                        pos: pos.clone().add(inter.face.normal).toArray(),
                        face: inter.face
                    };
                }
            }
        }

        return { pos: null, face: null };
    }

    private cellVisible(i: number, j: number, k: number): boolean {
        return !this.cellHidden(i, j, k) && this.shape.getCell(i, j, k) !== CellState.blank;
    }

    private cellHidden(i: number, j: number, k: number): boolean {
        const cell = this.cells.at(i, j, k);
        return cell !== undefined && !cell.visible;
    }

    public updateEdges(i: number, j: number, k: number): void {
        for (const i of this.shape.getLineEdges(j, k, LineDirection.row)) {
            this.addToQueue(i, j, k);
        }

        for (const j of this.shape.getLineEdges(i, k, LineDirection.col)) {
            this.addToQueue(i, j, k);
        }

        for (const k of this.shape.getLineEdges(i, j, LineDirection.depth)) {
            this.addToQueue(i, j, k);
        }
    }

    public eraseCell(i: number, j: number, k: number): void {
        if (
            this.placed_cells_state === CellState.unknown &&
            this.shape.getCell(i, j, k) === CellState.painted
        ) {
            return;
        }

        const cell = this.cells.at(i, j, k);
        const idx = this.raycastables.indexOf(cell);
        if (idx !== -1) {
            this.raycastables.splice(idx, 1);
        }
        this.shape.setCell(i, j, k, CellState.blank);
        this.renderer.removeCell(cell);
        this.cells.set(i, j, k, undefined);
        this.updateNeighbors(i, j, k);
        this.updateEdges(i, j, k);

        this.emit('eraseCell');
    }

    public paintCell(i: number, j: number, k: number): void {
        if (!this.shape.cellExists(i, j, k)) {
            return;
        }

        if (this.shape.getCell(i, j, k) === CellState.painted) {
            this.shape.setCell(i, j, k, CellState.unknown);
            this.addToQueue(i, j, k);
        } else {
            this.shape.setCell(i, j, k, CellState.painted);
            this.addToQueue(i, j, k);
        }

        this.updateEdges(i, j, k);
        this.emit('paintCell');
    }

    public placeCell(i: number, j: number, k: number): void {
        if (!this.shape.cellExists(i, j, k)) {
            this.shape.setCell(i, j, k, this.placed_cells_state);
            this.addToQueue(i, j, k);
            this.updateEdges(i, j, k);
        }
    }


    private visibleFaces(i: number, j: number, k: number): boolean[] {
        return [
            !this.cellVisible(i, j, k + 1), //front
            !this.cellVisible(i, j + 1, k), //top
            !this.cellVisible(i - 1, j, k), //left
            !this.cellVisible(i, j - 1, k), //bottom
            !this.cellVisible(i, j, k - 1), //back
            !this.cellVisible(i + 1, j, k) //right
        ];
    }

    // updates cells that have one face in common with the block at (i, j, k)
    public updateNeighbors(i: number, j: number, k: number): void {
        this.addToQueue(i + 1, j, k);
        this.addToQueue(i - 1, j, k);
        this.addToQueue(i, j + 1, k);
        this.addToQueue(i, j - 1, k);
        this.addToQueue(i, j, k + 1);
        this.addToQueue(i, j, k - 1);
    }

    private hideCell(i: number, j: number, k: number): void {
        const cell = this.cells.at(i, j, k);
        if (cell) {
            cell.visible = false;
        }
    }

    private showCell(i: number, j: number, k: number): void {
        const cell = this.cells.at(i, j, k);
        if (cell) {
            cell.visible = true;
        }
    }

    private showRow(i: number): void {
        for (let j = 0; j < this.shape.dims[1]; j++) {
            for (let k = 0; k < this.shape.dims[2]; k++) {
                this.showCell(i, j, k);
                this.addToQueue(i + 1, j, k);
                this.addToQueue(i - 1, j, k);
            }
        }
    }

    public hideRow(i: number): void {
        for (let j = 0; j < this.shape.dims[1]; j++) {
            for (let k = 0; k < this.shape.dims[2]; k++) {
                this.hideCell(i, j, k);
                this.addToQueue(i + 1, j, k);
                this.addToQueue(i - 1, j, k);
            }
        }
    }

    public hideDepth(k: number): void {
        for (let i = 0; i < this.shape.dims[0]; i++) {
            for (let j = 0; j < this.shape.dims[1]; j++) {
                this.hideCell(i, j, k);
                this.addToQueue(i, j, k + 1);
                this.addToQueue(i, j, k - 1);
            }
        }
    }

    public showDepth(k: number): void {
        for (let i = 0; i < this.shape.dims[0]; i++) {
            for (let j = 0; j < this.shape.dims[1]; j++) {
                this.showCell(i, j, k);
                this.addToQueue(i, j, k + 1);
                this.addToQueue(i, j, k - 1);
            }
        }
    }

    public hideRows(rows: LineRange): void {
        for (let row = rows.from; row < rows.to; row++) {
            this.hideRow(row);
        }
    }

    public showRows(rows: LineRange): void {
        for (let row = rows.from; row < rows.to; row++) {
            this.showRow(row);
        }
    }

    public hideDepths(depths: LineRange): void {
        for (let depth = depths.from; depth < depths.to; depth++) {
            this.hideDepth(depth);
        }
    }

    public showDepths(depths: LineRange): void {
        for (let depth = depths.from; depth < depths.to; depth++) {
            this.showDepth(depth);
        }
    }

    public get cellCount(): number {
        return this.raycastables.length;
    }

    public update(): void {
        this.clearQueue();
    }

    public setPlacedCellsState(state: CellState): void {
        this.placed_cells_state = state;
    }
}