import { AmbientLight, Color, DirectionalLight, Mesh, MeshBasicMaterial, WebGLRenderer } from "three";
import { CellSetRenderer } from "../CellSetRenderer";
import { CellState } from "../PicrossShape";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { PuzzleHintTextureManager } from "../PuzzleHintTextureManager";
import { colors } from "../Utils/Utils";

export class PuzzleHintEditorRenderer extends CellSetRenderer {

    protected hints_textures: PuzzleHintTextureManager;
    public static options = {
        bg_color: new Color('#81D4FA'),
        paint_color: new Color('#778beb'),
        erase_color: new Color('#dd4660'),
        build_color: new Color('#21a034'),
        hint_color: colors.black(),
        greyed_hint_color: new Color('#cdcdcd'),
        selection_helper_color: new Color('#000000')
    };

    constructor(puzzle: PicrossPuzzle, canvas: HTMLCanvasElement) {
        super(canvas);

        this.hints_textures = new PuzzleHintTextureManager(puzzle, {
            unknown_opacity: 1
        });

        this._scene.background = PuzzleHintEditorRenderer.options.bg_color;

        const rotation = Math.PI / 3;
        const r = Math.max(3 * Math.max(...puzzle.dims), 15);
        this.camera.position.set(
            r * Math.cos(rotation),
            puzzle.dims[1] + 5,
            r * Math.sin(rotation)
        );

        this.addLights();
    }

    public addCell(cell: Mesh): void {
        super.addCell(cell);
        // this.shape.checkResolved();
    }

    protected addLights(): void {
        const directional_light = new DirectionalLight(0xffffff, 1);

        directional_light.position.x = 1;
        directional_light.position.y = 1;
        directional_light.position.z = 0.75;
        directional_light.position.normalize();

        this.addObject3D(new AmbientLight(0xffffff, 0.5), directional_light);
    }


    public getCellMaterials(i: number, j: number, k: number, state: CellState): MeshBasicMaterial[] {
        return this.hints_textures.getCellMaterials(i, j, k, state);
    }

};