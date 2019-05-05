import { AmbientLight, Color, GridHelper, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneBufferGeometry, PointLight, Raycaster, WebGLRenderer } from "three";
import { CellSetRenderer } from "../CellSetRenderer";
import { CellState } from "../PicrossShape";
import { PuzzleRenderer } from "../Puzzle/PuzzleRenderer";
import { TextureUtils } from "../Utils/TextureUtils";
import { clampArray } from "../Utils/Utils";

export class PuzzleEditorRenderer extends CellSetRenderer {

    private floor_plane: Mesh;
    private floor_grid: GridHelper;
    private _dims = [16, 16, 16];
    // private _dims = [32, 32, 32];
    private _max_dims = [16, 16, 16];
    // private _max_dims = [32, 32, 32];
    private unk_materials: MeshLambertMaterial[];
    private painted_materials: MeshLambertMaterial[];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.initScene();

        const unk_mat = new MeshLambertMaterial({
            map: TextureUtils.generateHintTexture(null, {
                line_width: 1,
                fill_color: new Color('#1f9d55'),
                line_color: new Color('#ffffff')
            }),
            // transparent: true,
            // opacity: 0.8
        });

        const painted_mat = new MeshLambertMaterial({
            map: TextureUtils.generateHintTexture(null, {
                line_width: 1,
                fill_color: PuzzleRenderer.options.paint_color,
                line_color: new Color('#000000')
            })
        });

        this.unk_materials = [
            unk_mat,
            unk_mat,
            unk_mat,
            unk_mat,
            unk_mat,
            unk_mat
        ];

        this.painted_materials = [
            painted_mat,
            painted_mat,
            painted_mat,
            painted_mat,
            painted_mat,
            painted_mat
        ];
    }

    private initScene(): void {
        this._scene.background = new Color('whitesmoke');

        this.floor_plane = new Mesh(
            new PlaneBufferGeometry(this._max_dims[0], this._max_dims[2]),
            new MeshBasicMaterial({ color: 0x0000ff, wireframe: true, visible: false })
        );

        this.floor_plane.position.setX(this._max_dims[0] / 2);
        this.floor_plane.position.setZ(this._max_dims[2] / 2);

        this.floor_plane.geometry.rotateX(-Math.PI / 2);

        this.floor_grid = new GridHelper(this._dims[0], this._dims[0]);

        this.floor_grid.position.setX(this._max_dims[0] / 2);
        this.floor_grid.position.setZ(this._max_dims[1] / 2);

        this._camera.position.setZ(20);
        this._camera.position.setY(5);

        this._scene.add(this.floor_grid, this.floor_plane);
        this.addLights();

    }

    private addLights(): void {
        this.camera.add(new PointLight(0xffffff, 1));
        this.addObject3D(new AmbientLight(0xffffff, 0.5));
        this._scene.add(this.camera);
    }


    public getCellMaterials(i: number, j: number, k: number, state: CellState): Material[] {
        return state === CellState.unknown ? this.unk_materials : this.painted_materials;
    }

    public rayCast(raycaster: Raycaster): number[] {

        const inter = raycaster.intersectObject(this.floor_plane);

        if (inter.length > 0) {
            const coords = clampArray([
                Math.floor(inter[0].point.x),
                Math.floor(inter[0].point.y),
                Math.floor(inter[0].point.z)
            ], [0, 0, 0], this._max_dims);

            return coords;
        }

        return null;
    }

    public get dims(): number[] {
        return this._dims;
    }

    public get maxDims(): number[] {
        return this._max_dims;
    }

}