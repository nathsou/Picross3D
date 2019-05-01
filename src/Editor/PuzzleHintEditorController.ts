import { saveAs } from 'file-saver';
import { PicrossController } from "../PicrossController";
import { PicrossGame, ScreenType } from "../PicrossGame";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { GUI } from "../UI/GUI";
import { GUIButtonBehavior } from "../UI/GUIButtton";
import { GUIImageButton } from "../UI/GUIImageButton";
import { GUIModalWindow } from "../UI/GUIModalWindow";
import { GUITextButton } from "../UI/GUITextButton";
import { ImageStore } from "../UI/ImageStore";
import { PuzzleHintEditorRenderer } from "./PuzzleHintEditorRenderer";

export class PuzzleHintEditorController extends PicrossController {

    private puzzle: PicrossPuzzle;
    private gui: GUI;

    constructor(puzzle: PicrossPuzzle, renderer: PuzzleHintEditorRenderer) {
        super(renderer, puzzle.shape);
        this.puzzle = puzzle;

        this.cells.on('eraseCell', () => {
            this.puzzle.checkResolved();
        });
        this.cells.on('paintCell', () => {
            this.puzzle.checkResolved();
        });

        this.puzzle.on('resolved', () => {
            this.orbit_controls.autoRotate = true;
            this.orbit_controls.autoRotateSpeed = 6;
            if (this.handles_manager !== undefined) {
                this.handles_manager.hideHandles();
            }
            this.renderer.needsReRender();
            // localStorageManager.addResolvedPuzzle(this.puzzle.name);
        });

        this.initGUI();
    }

    private async initGUI() {
        this.gui = new GUI(window.innerWidth, window.innerHeight, this.renderer.threeRenderer);

        const options_btn = new GUIImageButton(
            await ImageStore.getSettingsButton({ bg_color: '#ffffff' }),
            {
                width: 50,
                height: 25,
                fit_img: true,
                img_pos: 'center',
                behavior: GUIButtonBehavior.SIMPLE,
                bg_color: 'white',
                hover_color: 'lightgray',
                top: 30,
                right: 40
            });

        const back_btn = new GUIImageButton(
            await ImageStore.getBackButton(),
            {
                width: 40,
                height: 30,
                fit_img: true,
                img_pos: 'center',
                behavior: GUIButtonBehavior.SIMPLE,
                bg_color: 'white',
                hover_color: 'lightgray',
                top: 30,
                left: 40
            });

        const options_modal = new GUIModalWindow(
            {
                width: 400,
                height: 300,
                visible: false,
                header_height: 25,
                text_options: {
                    text_color: 'white'
                },
                header_color: '#000000',
                title: 'Select an action',
                left: '50%',
                top: '50%'
            }
        );

        const btns_optns = {
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

        const test_btn = new GUITextButton({
            ...btns_optns,
            text: 'Test Puzzle 🤔'
        });

        const reset_btn = new GUITextButton({
            ...btns_optns,
            text: 'Reset 🛑'
        });

        const export_btn = new GUITextButton({
            ...btns_optns,
            text: 'Export ⬇️'
        });

        const finish_btn = new GUITextButton({
            ...btns_optns,
            text: 'Finish 🎉'
        });

        options_modal.add(test_btn, reset_btn, export_btn, finish_btn);

        test_btn.onClick(() => {
            PicrossGame.getInstance().changeScreen(ScreenType.PUZZLE, {
                puzzle: this.puzzle,
                from_hint_editor: true
            });
        });

        reset_btn.onClick(() => {
            this.restore();
            this.puzzle.restart();
            options_modal.close();
        });

        export_btn.onClick(() => {
            const puzzle = new Blob(
                [JSON.stringify(this.puzzle.toJSON())], {
                    type: "application/json;charset=utf-8"
                });

            saveAs(puzzle, "puzzle.json");
        });

        options_btn.onClick(() => {
            options_modal.open();
            this.orbit_controls.enabled = false;
            this.paused = true;
        });

        options_modal.onClose(() => {
            this.orbit_controls.enabled = true;
            this.paused = false;
        });

        back_btn.onClick(() => {
            PicrossGame.getInstance().changeScreen(ScreenType.EDITOR, {
                shape: this.puzzle.shape
            });
        });

        this.gui.add(options_modal, options_btn, back_btn);
    }

    protected rayCast(): number[] {

        if (!this.needs_recast) return null;

        if (this.handles_manager) {
            if (this.handles_manager.rayCast(this.mouse, this.renderer.camera)) {
                return null;
            }
        } else {
            this.raycaster.setFromCamera(this.mouse, this.renderer.camera);
        }

        const inter = this.cells.rayCast(this.raycaster, this.actions.builder.selected);

        // this.selection.setHoveredCell(coords);
        // this.handleSelection();

        if (inter.face !== null) {

        }

        this.needs_recast = false;

        return inter.pos;
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