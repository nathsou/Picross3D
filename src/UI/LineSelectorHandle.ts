import { Mesh, MeshLambertMaterial, OctahedronBufferGeometry, Vector3 } from "three";
import EventEmitter from "../Utils/EventEmitter";
import { LineDirection } from "../PicrossShape";

type LineSelectorHandleEventName = 'hide_line';

export class LineSelectorHandle extends EventEmitter<LineSelectorHandleEventName> {

    private _mesh: Mesh;
    private original_position: Vector3;
    private _hovered: boolean;
    private mouse_down = false;
    private direction: Vector3;
    private _plane: Mesh;
    private last_click = 0;
    private hidden_cells = 0;
    private line_width: number;
    private line_depth: number;
    private side_x = 1;
    private side_z = 1;
    private radius: number;
    private _locked = false;

    constructor(
        position: Vector3,
        direction: LineDirection,
        plane: Mesh, line_width: number,
        line_depth: number,
        radius: number
    ) {

        super();
        this.radius = radius;

        this._mesh = new Mesh(
            new OctahedronBufferGeometry(this.radius),
            new MeshLambertMaterial({
                color: ['#eb2f06', '#1e3799'][direction],
                transparent: true,
                opacity: 0.7
            })
        );

        this._mesh.scale.set(1, 0.5, 0.5);

        if (direction === LineDirection.col) {
            this._mesh.rotateY(Math.PI / 2);
        }

        this.original_position = position.clone();
        this.line_width = line_width;
        this.line_depth = line_depth;

        this._mesh.position.set(position.x, position.y, position.z);

        switch (direction) {
            case LineDirection.row:
                this.direction = new Vector3(1, 0, 0);
                break;
            case LineDirection.col:
                this.direction = new Vector3(0, 0, 1);
                break;
            case LineDirection.depth:
                this.direction = new Vector3(0, 1, 0);
                break;
        }

        this._plane = plane;
    }

    public get mesh(): Mesh {
        return this._mesh;
    }

    public onHover(): void {
        this.hovered = true;
        (this._mesh.material as MeshLambertMaterial).opacity = 1.0;
    }

    public onHoverEnd(): void {
        this.hovered = false;
        (this._mesh.material as MeshLambertMaterial).opacity = 0.5;
    }

    public onMouseDown(plane_offset: Vector3): void {
        this.mouse_down = true;
        // (this._mesh.material as MeshBasicMaterial).color = new Color(0x000000);
    }

    public onMouseUp(): void {
        this.mouse_down = false;
        const pos = new Vector3(
            this.original_position.x + this.direction.x * this.hidden_cells,
            this.original_position.y + this.direction.y * this.hidden_cells,
            this.original_position.z + this.direction.z * this.hidden_cells
        );
        this.mesh.position.copy(pos);
    }

    public onMouseMove(plane_inter: Vector3): void {

        const dir = this.direction.x !== 0 ? this.side_x : this.side_z;

        const delta = new Vector3(
            (plane_inter.x - this.original_position.x) * this.direction.x * dir,
            (plane_inter.y - this.original_position.y) * this.direction.y * dir,
            (plane_inter.z - this.original_position.z) * this.direction.z * dir
        );

        this.mesh.position.set(
            this.original_position.x + delta.x * dir,
            this.original_position.y + delta.y * dir,
            this.original_position.z + delta.z * dir
        );

        const hc = delta.dot(this.direction) * dir;

        this.setHiddenCells(Math.sign(hc) * Math.floor(Math.abs(hc)));
    }

    public onClick(): void {
        const now = Date.now();

        // double click
        if (now - this.last_click < 400) {
            this.mesh.position.copy(this.original_position);
            this.last_click = 0;
            this.setHiddenCells(0);
        }

        this.last_click = now;
    }

    // move handles according to the camera's angle
    public setSide(side_x: 1 | -1, side_z: 1 | -1): void {

        if (this.side_x !== side_x) {

            if (this.direction.x !== 0) { // row handle
                if (!this.locked) {
                    const delta = (this.line_width + 2) * side_x;
                    this.original_position.x += delta;
                    this._mesh.position.x += delta;
                    this._plane.position.x += 3 * side_x;
                }
            } else { // depth handle
                const delta = this.line_width * side_x;
                this.original_position.x -= delta;
                this._mesh.position.x -= delta;
                this._plane.position.x -= delta;
            }

            this.side_x = side_x;
        }

        if (this.side_z !== side_z) {
            if (this.direction.x !== 0) { // row handle
                const delta = (this.line_depth) * side_z;
                this.original_position.z -= delta;
                this._mesh.position.z -= delta;
                this._plane.position.z -= delta;
            } else { // depth handle
                if (!this.locked) {
                    const delta = (this.line_depth + 2) * side_z;
                    this.original_position.z += delta;
                    this._mesh.position.z += delta;
                    this._plane.position.z += 3 * side_z;
                }
            }

            this.side_z = side_z;
        }
    }

    public hide(): void {
        this.mesh.visible = false;
    }

    public show(): void {
        this.mesh.visible = true;
    }

    public get hovered(): boolean {
        return this._hovered;
    }

    public get mouseDown(): boolean {
        return this.mouse_down;
    }

    public get plane(): Mesh {
        return this._plane;
    }

    public get hiddenCells(): number {
        return this.hidden_cells;
    }

    private setHiddenCells(nb_hidden_cells: number) {
        const hc = this.hidden_cells;
        this.hidden_cells = nb_hidden_cells;

        this._locked = nb_hidden_cells !== 0;

        if (hc !== nb_hidden_cells) {
            this.emit('hide_line', nb_hidden_cells);
        }

    }

    public get locked(): boolean {
        return this._locked;
    }

    public set hovered(is_hovered: boolean) {
        this._hovered = is_hovered;
    }
}