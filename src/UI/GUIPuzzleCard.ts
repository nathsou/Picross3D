import { WebGLRenderer } from "three";
import { CellMeshSet } from "../CellMeshSet";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { PuzzleRenderer } from "../Puzzle/PuzzleRenderer";
import { PuzzleJSON } from "../Puzzle/Puzzles";
import { GUITextButton, GUITextButtonComputedProperties, GUITextButtonOptions } from "./GUITextButton";

export interface GUIPuzzleCardOptions extends GUITextButtonOptions {
    puzzle: PuzzleJSON
}

export interface GUIPuzzleCardComputedProperties extends GUITextButtonComputedProperties {
    puzzle: PuzzleJSON
}

export class GUIPuzzleCard<
    P extends GUIPuzzleCardOptions,
    C extends GUIPuzzleCardComputedProperties
    > extends GUITextButton<P, C> {

    // private puzzle_img: ImageData;

    constructor(optns?: Partial<P>) {
        super({
            // bg_color: localStorageManager.isPuzzleResolved(optns.puzzle.name) ? 'grey' : defaultButtonOptions.bg_color,
            ...optns
        });

        // this.generatePreview();
    }

    private generatePreview(): void {
        const width = this.computedProperties.width as number;
        const height = this.computedProperties.height as number;

        const puzzle = PicrossPuzzle.fromJSON(this.computedProperties.puzzle);
        console.log(puzzle);
        const cnv = document.createElement('canvas');
        cnv.width = width;
        cnv.height = height;
        const renderer = new WebGLRenderer({ canvas: cnv });
        renderer.setSize(width, height);
        const cell_renderer = new PuzzleRenderer(puzzle, renderer);
        const mesh = new CellMeshSet(puzzle.shape, cell_renderer, false);
        mesh.generateMeshes();
        mesh.update();

        cell_renderer.camera.position.set(puzzle.getDimensions()[0] / 2, puzzle.getDimensions()[1] / 2, 12);
        console.log(cell_renderer.camera.position);
        cell_renderer.needsReRender();
        cell_renderer.render();

        const pixels = new Uint8Array(width * height * 4);

        const gl = cnv.getContext('webgl');

        gl.readPixels(
            0,
            0,
            width,
            height,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            pixels
        );

        // this.puzzle_img = new ImageData(new Uint8ClampedArray(pixels), width, height);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);

        // ctx.beginPath();
        // ctx.putImageData(this.puzzle_img, this.pos.x, this.pos.y);
        // ctx.closePath();
        // ctx.fill();
    }

}