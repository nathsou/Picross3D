import { Vector2, WebGLRenderer } from "three";
import { PicrossGame, ScreenType } from "../PicrossGame";
import { collections } from "../PuzzleCollections/PuzzleCollections";
import { GUI } from "../UI/GUI";
import { GUIGridLayout } from "../UI/GUIGridLayout";
import { dark_theme } from "../UI/GUIProperties";
import { GUITextButton } from "../UI/GUITextButton";
import { capitalize } from "../Utils/Utils";
import { Screen, ScreenData } from "./Screen";

export class PuzzleSelectionScreen extends Screen {

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

        const grid = new GUIGridLayout({
            grid_cols: 'auto',
            width: '80%',
            max_width: 1000,
            min_width: 250,
            height: 500,
            left: '50%',
            top: '50%',
            border_size: 3
        });

        this.gui.add(grid);

        for (const collection_name of Object.keys(collections)) {
            const scene_btn = new GUITextButton({
                text: capitalize(collection_name),
                width: '23%',
                min_width: 200,
                height: 150,
                margin_left: 2,
                margin_right: 2,
                margin_top: 2,
                margin_bottom: 2
            });

            scene_btn.onClick(() => {
                PicrossGame.getInstance().changeScreen(ScreenType.COLLECTION_DETAILS, { collection_name });
            });

            grid.add(scene_btn);
        }

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