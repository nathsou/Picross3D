import { Color, MeshBasicMaterial } from "three";
import { CellState, LineDirection, LineHint } from "./PicrossShape";
import { PicrossPuzzle } from "./Puzzle/PicrossPuzzle";
import { PuzzleRenderer } from "./Puzzle/PuzzleRenderer";
import { dark_theme } from "./UI/GUIProperties";
import { TextureUtils } from "./Utils/TextureUtils";

export interface PuzzleHintTextureManagerOptions {
    paint_color: Color,
    unknown_color: Color,
    text_color: Color,
    unknown_opacity: number
};

export class PuzzleHintTextureManager {

    private puzzle: PicrossPuzzle;
    private materials: Map<string, MeshBasicMaterial>;
    private options: PuzzleHintTextureManagerOptions;

    constructor(puzzle: PicrossPuzzle, options?: Partial<PuzzleHintTextureManagerOptions>) {
        this.puzzle = puzzle;
        this.materials = new Map<string, MeshBasicMaterial>();

        this.options = {
            paint_color: new Color(dark_theme ? '#4834d4' : '#778beb'),
            unknown_color: new Color(dark_theme ? 'black' : 'white'),
            text_color: new Color(dark_theme ? 'white' : 'black'),
            unknown_opacity: 1,
            ...options
        };
    }

    protected getMaterial(hint: LineHint, opacity: number, options?: TextureUtils.TextureOptions): MeshBasicMaterial {

        const key = JSON.stringify(hint) + '_' + (options ? JSON.stringify(options) : '');

        if (!this.materials.has(key)) {
            this.materials.set(key, new MeshBasicMaterial({
                map: TextureUtils.generateHintTexture(hint, options),
                transparent: opacity !== 1,
                opacity: opacity
            }));
        }

        return this.materials.get(key);
    }

    public getCellMaterials(i: number, j: number, k: number, state: CellState): MeshBasicMaterial[] {
        const painted = state === CellState.painted;

        const depth_hint = this.puzzle.getLineHint(i, j, LineDirection.depth);
        const col_hint = this.puzzle.getLineHint(i, k, LineDirection.col);
        const row_hint = this.puzzle.getLineHint(j, k, LineDirection.row);

        const labels = [
            {
                hint: depth_hint,
                greyed: depth_hint === null ? false : PicrossPuzzle.lineSatifiesHint(this.puzzle.getDepth(i, j), depth_hint)
            },
            {
                hint: col_hint,
                greyed: col_hint === null ? false : PicrossPuzzle.lineSatifiesHint(this.puzzle.getCol(i, k), col_hint)
            },
            {
                hint: row_hint,
                greyed: row_hint === null ? false : PicrossPuzzle.lineSatifiesHint(this.puzzle.getRow(j, k), row_hint)
            }
        ];

        // show labels in the back
        labels.push(labels[1], labels[0], labels[2]);

        const fill_color = painted ? this.options.paint_color : this.options.unknown_color;
        const text_color = this.options.text_color;

        return labels.map(label => this.getMaterial(
            label.hint,
            state === CellState.unknown ? this.options.unknown_opacity : 1, {
                fill_color: fill_color,
                text_color: label.greyed ? PuzzleRenderer.options.greyed_hint_color : text_color
            }));
    }
}