
import { Vector2, WebGLRenderer } from "three";
import { PicrossGame, ScreenType } from "../PicrossGame";
import { GUI } from "../UI/GUI";
import { GUIGridLayout } from "../UI/GUIGridLayout";
import { dark_theme, MarginProperty } from "../UI/GUIProperties";
import { GUITextBox } from "../UI/GUITextBox";
import { GUITextButton } from "../UI/GUITextButton";
import { Screen, ScreenData } from "./Screen";

export class MenuScreen extends Screen {

    private gui: GUI;
    private size: Vector2;

    constructor(three_renderer: WebGLRenderer, params: ScreenData) {
        super(three_renderer, params);
        this.size = new Vector2();
        ///@ts-ignore -> .d.ts not up to date
        three_renderer.getSize(this.size);
        this.gui = new GUI(this.size.x, this.size.y, three_renderer);
        this.gui.setClearColor(dark_theme ? 'black' : 'white');
        this.initComponents();
    }

    private initComponents(): void {

        const menu_grid = new GUIGridLayout({
            grid_cols: 1,
            width: '60%',
            height: '60%',
            min_height: 300,
            min_width: 400,
            // margin_left: 'auto',
            // margin_right: 'auto'
            left: '50%',
            top: '50%',
            border: true,
            // border_color: GUI.colors.dark_theme ? 'white' : 'black',
            border_size: 3
        });

        const title = new GUITextBox({
            text: 'Picross',
            text_options: {
                text_align: 'center',
                font: 'normal 44px Consolas, monaco, monospace',
            },
            width: 300,
            height: '20%',
            bg_color: 'transparent',
            margin_left: 'auto',
            margin_right: 'auto',
            margin_top: '10%',
            border: false
        });

        const btn_grid = new GUIGridLayout({
            grid_cols: 1,
            width: '70%',
            max_width: 600,
            min_width: 250,
            height: '35%',
            bg_color: 'transparent',
            border_color: 'black',
            margin_left: 'auto',
            margin_right: 'auto',
            border: false
        });

        const horizontal_margin: MarginProperty = 'auto';
        const vertical_margin: MarginProperty = 2;
        const btn_width = '90%';

        const play_btn = new GUITextButton({
            text: 'Select Puzzle',
            height: 40,
            width: btn_width,
            max_width: 400,
            min_width: 100,
            margin_left: horizontal_margin,
            margin_right: horizontal_margin,
            margin_top: vertical_margin,
            margin_bottom: vertical_margin
        });

        const editor_btn = new GUITextButton({
            text: 'Launch Editor',
            width: btn_width,
            height: 40,
            max_width: 400,
            min_width: 100,
            margin_left: horizontal_margin,
            margin_right: horizontal_margin,
            margin_top: vertical_margin,
            margin_bottom: vertical_margin
        });

        const settings_btn = new GUITextButton({
            text: 'Settings',
            width: btn_width,
            height: 40,
            max_width: 400,
            min_width: 100,
            margin_left: horizontal_margin,
            margin_right: horizontal_margin,
            margin_top: vertical_margin,
            margin_bottom: vertical_margin
        });

        play_btn.onClick(() => {
            PicrossGame.getInstance().changeScreen(ScreenType.PUZZLE_SELECTION, {});
        });

        editor_btn.onClick(() => {
            PicrossGame.getInstance().changeScreen(ScreenType.EDITOR, {});
        });

        settings_btn.onClick(() => {
            PicrossGame.getInstance().changeScreen(ScreenType.SETTINGS, {});
        });


        menu_grid.add(title, btn_grid);
        btn_grid.add(play_btn, editor_btn, settings_btn);
        this.gui.add(menu_grid);
    }

    public startRenderLoop(): void {
        this.three_renderer.setAnimationLoop(() => {
            if (this.gui.update()) {
                this.gui.render();
            }
        });
    }

    public dispose(): void {
        this.gui.dispose();
    }

}