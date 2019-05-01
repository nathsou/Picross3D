import { Vector2, WebGLRenderer } from "three";
import { PicrossControls, PicrossGame, ScreenType } from "../PicrossGame";
import { GUI } from "../UI/GUI";
import { GUIGridLayout } from "../UI/GUIGridLayout";
import { GUIImageButton } from "../UI/GUIImageButton";
import { GUIModalWindow } from "../UI/GUIModalWindow";
import { dark_theme, MarginProperty } from "../UI/GUIProperties";
import { GUITextBox } from "../UI/GUITextBox";
import { GUITextButton } from "../UI/GUITextButton";
import { ImageStore } from "../UI/ImageStore";
import { Screen, ScreenData } from "./Screen";

export class SettingsScreen extends Screen {

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

    private async initComponents() {

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
            border_size: 3
        });

        const title = new GUITextBox({
            text: 'Settings',
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

        const controls_btn = new GUITextButton({
            text: 'Controls',
            height: 40,
            width: btn_width,
            max_width: 400,
            min_width: 100,
            margin_left: horizontal_margin,
            margin_right: horizontal_margin,
            margin_top: vertical_margin,
            margin_bottom: vertical_margin
        });

        const controls_modal = this.initControlsModal();

        controls_btn.onClick(() => {
            controls_modal.open();
        });

        const back_btn = new GUIImageButton(
            await ImageStore.getBackButton(),
            {
                position: 'absolute',
                top: 7.5,
                left: 10,
                width: 40,
                height: 30,
                bg_color: dark_theme ? 'black' : 'white',
                hover_color: dark_theme ? 'darkgray' : 'lightgray'
            }
        );

        back_btn.onClick(() => {
            PicrossGame.getInstance().changeScreen(ScreenType.MENU, {});
        });

        menu_grid.add(title, btn_grid, back_btn);
        btn_grid.add(controls_btn);
        this.gui.add(menu_grid, controls_modal);
    }

    public initControlsModal(): GUIModalWindow {
        const btns_optns = {
            width: '70%',
            min_width: 100,
            max_width: 400,
            height: 40,
            margin_top: 2,
            margin_bottom: 2,
            margin_left: 'auto',
            margin_right: 'auto',
            top: 27,
            visible: false
        };

        const controls_modal = new GUIModalWindow({
            visible: false,
            header_height: 25,
            text_options: {
                text_color: 'white'
            },
            header_color: '#000000',
            title: 'Controls',
            width: 400,
            height: 300,
            left: '50%',
            top: '50%'
        });

        const hammer_key_btn = new GUITextButton({
            ...btns_optns,
            text: `Hammer: ${PicrossGame.getInstance().controls.hammer}`
        });

        const brush_key_btn = new GUITextButton({
            ...btns_optns,
            text: `Brush: ${PicrossGame.getInstance().controls.brush}`
        });

        const builder_key_btn = new GUITextButton({
            ...btns_optns,
            text: `Builder: ${PicrossGame.getInstance().controls.builder}`
        });

        [hammer_key_btn, brush_key_btn, builder_key_btn].forEach(btn => btn.onClick(() => {
            btn.setOption('text', `Press any key`);
            //TODO: Check that the key is not already used
            const key_listener = (e: KeyboardEvent) => {
                const name = btn.properties.text.split(':')[0];
                PicrossGame.getInstance().controls[name.toLowerCase() as keyof PicrossControls] = e.code;
                btn.setOption('text', `${name}: ${e.code}`);
                window.removeEventListener('keydown', key_listener);
            };

            window.addEventListener('keydown', key_listener);
        }));

        controls_modal.add(hammer_key_btn, brush_key_btn, builder_key_btn);

        return controls_modal;
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