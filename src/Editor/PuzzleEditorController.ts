import { PicrossController } from "../PicrossController";
import { PicrossGame, ScreenType } from "../PicrossGame";
import { CellState, PicrossShape } from "../PicrossShape";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { PicrossSolver } from "../Solver/PicrossSolver";
import { GUI } from "../UI/GUI";
import { GUIButtonBehavior } from "../UI/GUIButtton";
import { GUIImageButton } from "../UI/GUIImageButton";
import { GUIModalWindow } from "../UI/GUIModalWindow";
import { defaultTextButtonOptions, GUITextButton, GUITextButtonOptions } from "../UI/GUITextButton";
import { ImageStore } from "../UI/ImageStore";
import { ModelVoxelizer } from "./ModelVoxelizer";
import { PuzzleEditorRenderer } from "./PuzzleEditorRenderer";

export class PuzzleEditorController extends PicrossController {

    protected renderer: PuzzleEditorRenderer;
    private gui: GUI;
    private file_selector: HTMLInputElement;
    private options_modal: GUIModalWindow;
    private btns_optns: GUITextButtonOptions;

    constructor(renderer: PuzzleEditorRenderer, shape: PicrossShape) {
        super(renderer, shape, false, true);
        this.orbit_controls.target.y = 0;
        this.cells.setPlacedCellsState(CellState.painted);
        this.initGUI();
    }

    private async initGUI() {

        this.btns_optns = {
            ...defaultTextButtonOptions,
            width: '70%',
            min_width: 130,
            max_width: 400,
            height: 40,
            margin_top: 2,
            margin_bottom: 2,
            margin_left: 'auto',
            margin_right: 'auto',
            top: 27
        };

        this.gui = new GUI(window.innerWidth, window.innerHeight, this.renderer.threeRenderer);

        this.options_modal = new GUIModalWindow({
            visible: false,
            header_height: 25,
            text_options: {
                text_color: 'white'
            },
            header_color: '#000000',
            title: 'Select an action',
            width: 400,
            height: 300,
            left: '50%',
            top: '50%'
        });

        const options_btn = new GUIImageButton(
            await ImageStore.getSettingsButton({ bg_color: '#ff0000' }),
            {
                width: 50,
                height: 25,
                fit_img: true,
                img_pos: 'center',
                behavior: GUIButtonBehavior.SIMPLE,
                border_color: 'black',
                border_size: 3,
                top: 30,
                right: 40,
                bg_color: 'white',
                hover_color: 'lightgray'
            });

        options_btn.onClick(() => {
            this.options_modal.open();
            this.orbit_controls.enabled = false;
            this.paused = true;
        });

        this.options_modal.onClose(() => {
            this.orbit_controls.enabled = true;
            this.paused = false;
        });

        const menu_btn = new GUITextButton({
            ...this.btns_optns,
            text: 'Home Menu'
        });

        const test_btn = new GUITextButton({
            ...this.btns_optns,
            text: 'Generate Puzzle'
        });


        const reset_btn = new GUITextButton({
            ...this.btns_optns,
            text: 'Reset'
        });

        reset_btn.onClick(() => {

            // const history = [...this.shape.history];
            this.shape.reset();
            this.cells.clear();
            this.cells.update();
            this.options_modal.close();
        });

        this.options_modal.add(menu_btn, test_btn, reset_btn);

        this.gui.add(options_btn, this.options_modal);

        test_btn.onClick(() => {
            this.shape.trim();
            const puzzle = new PicrossPuzzle(this.shape);
            PicrossSolver.removeHints(puzzle);
            this.shape.fillBoundingBox();
            PicrossGame.getInstance().changeScreen(ScreenType.HINT_EDITOR, {
                puzzle: puzzle,
                from_hint_editor: true
            });
            // this.renderer.showHints(puzzle);
            // this.cells.updateAllCells();
            // this.options_modal.close();


            // if (puzzle.isSolvable()) {
            //     PicrossSolver.removeHints(puzzle);
            //     console.log(JSON.stringify(puzzle.toJSON()));
            // } else {
            //     console.error('Puzzle not linesolvable');
            // }

            // PicrossGame.getInstance().changeScreen(ScreenType.PUZZLE, {
            //     puzzle: puzzle
            // });

        });

        menu_btn.onClick(() => {
            PicrossGame.getInstance().changeScreen(ScreenType.MENU, {});
        });

        this.options_modal.add(this.handleFileSelection());
    }

    private handleFileSelection(): GUITextButton {
        this.file_selector = document.createElement('input');
        this.file_selector.type = 'file';
        this.file_selector.accept = '.obj,.json';

        const import_btn = new GUITextButton({
            ...this.btns_optns,
            text: 'Import'
        });

        import_btn.onClick(() => {
            this.file_selector.click();
        });

        this.file_selector.addEventListener('change', () => {
            const model = this.file_selector.files[0];
            if (model !== undefined) {
                const uri = window.URL.createObjectURL(model);
                if (model.type === 'application/json') {
                    this.loadJsonPuzzle(uri);
                } else {
                    this.loadModel(uri);
                }
                this.options_modal.close();
            }
        });

        return import_btn;
    }

    private async loadJsonPuzzle(uri: string) {
        const data = await (await fetch(uri)).text();

        try {
            const puzzle = PicrossPuzzle.fromJSON(data);
            const shape = PicrossSolver.solve(puzzle);
            if (shape === null) {
                throw new Error('Puzzle is not linesolvable')
            }
            const offset = [0, 2].map(d => Math.floor((this.shape.dims[d] - shape.dims[d]) / 2));

            for (let i = 0; i < shape.dims[0]; i++) {
                for (let j = 0; j < shape.dims[1]; j++) {
                    for (let k = 0; k < shape.dims[2]; k++) {
                        this.shape.setCell(i + offset[0], j, k + offset[1], shape.getCell(i, j, k));
                    }
                }
            }

            this.cells.updateAllCells();
        } catch (e) {
            const error_modal = new GUIModalWindow({
                visible: true,
                header_height: 25,
                text_options: {
                    text_color: 'white'
                },
                header_color: '#ff0000',
                title: (e as Error).message,
                width: 400,
                height: 300,
                left: '50%',
                top: '50%'
            });

            this.gui.add(error_modal);
        }
    }

    private loadModel(uri: string): void {
        ModelVoxelizer.load(uri, this.shape).then(() => {
            this.cells.updateAllCells();
        });
    }

    // raycast against the floor
    protected rayCast(): number[] {

        if (!this.needs_recast) return null;

        if (!super.rayCast()) {
            this.needs_recast = false;
            const coords = this.renderer.rayCast(this.raycaster);
            this.selection.setHoveredCell(coords);
            this.handleSelection();

            return coords;
        }

        this.needs_recast = false;
        return null;
    }

    protected render(): void {
        const gui_updated = this.gui.update();
        if (gui_updated) {
            this.renderer.needsReRender();
        }

        if (this.renderer.render() || gui_updated) {
            this.gui.render();
        }
    }

    public dispose(): void {
        super.dispose();
        this.gui.dispose();
    }

}