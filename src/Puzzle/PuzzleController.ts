import { PicrossController } from "../PicrossController";
import { PicrossGame, ScreenType } from "../PicrossGame";
import { GUI } from "../UI/GUI";
import { GUIButtonBehavior } from "../UI/GUIButtton";
import { GUIImageButton } from "../UI/GUIImageButton";
import { GUIModalWindow } from "../UI/GUIModalWindow";
import { GUITextButton } from "../UI/GUITextButton";
import { ImageStore } from "../UI/ImageStore";
import { PicrossPuzzle } from "./PicrossPuzzle";
import { PuzzleRenderer } from "./PuzzleRenderer";

export class PuzzleController extends PicrossController {

    private puzzle: PicrossPuzzle;
    private gui: GUI;
    private from_hint_editor: boolean;

    constructor(puzzle: PicrossPuzzle, renderer: PuzzleRenderer, from_hint_editor: boolean) {
        super(renderer, puzzle.shape);
        this.puzzle = puzzle;
        this.from_hint_editor = from_hint_editor;

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
            }
        );


        if (this.from_hint_editor) {
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
                }
            );

            back_btn.onClick(() => {
                PicrossGame.getInstance().changeScreen(ScreenType.HINT_EDITOR, {
                    puzzle: this.puzzle
                });
            });

            this.gui.add(back_btn);
        }

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

        const menu_btn = new GUITextButton({
            ...btns_optns,
            text: 'Home Menu'
        });

        const restart_btn = new GUITextButton({
            ...btns_optns,
            text: 'Restart'
        });

        options_modal.add(menu_btn, restart_btn);

        menu_btn.onClick(() => {
            PicrossGame.getInstance().changeScreen(ScreenType.MENU, {});
        });

        restart_btn.onClick(() => {
            this.restore();
            this.puzzle.restart();
            options_modal.close();
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

        this.gui.add(options_modal, options_btn);
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