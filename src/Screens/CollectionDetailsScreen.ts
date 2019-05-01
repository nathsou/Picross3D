import { Vector2, WebGLRenderer } from "three";
import { PicrossGame, ScreenType } from "../PicrossGame";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { collections } from "../PuzzleCollections/PuzzleCollections";
import { GUI } from "../UI/GUI";
import { GUIGridLayout } from "../UI/GUIGridLayout";
import { GUIPuzzleCard } from "../UI/GUIPuzzleCard";
import { Screen, ScreenData } from "./Screen";
import { dark_theme } from "../UI/GUIProperties";

export interface CollectionDetailsScreenData extends ScreenData {
    collection_name: string
}

export class CollectionDetailsScreen extends Screen {

    private gui: GUI;
    private size: Vector2;

    constructor(three_renderer: WebGLRenderer, params: CollectionDetailsScreenData) {
        super(three_renderer, params);
        this.size = new Vector2();
        ///@ts-ignore -> .d.ts not up to date
        three_renderer.getSize(this.size);
        this.gui = new GUI(this.size.x, this.size.y, three_renderer);
        this.gui.setClearColor(dark_theme ? 'black' : 'white');
        this.initComponents();
    }

    private initComponents(): void {

        const collection_name = (this.data as CollectionDetailsScreenData).collection_name;

        const grid = new GUIGridLayout({
            grid_cols: 'auto',
            width: '80%',
            max_width: 800,
            min_width: 250,
            height: 500,
            left: '50%',
            top: '50%',
            border_size: 3
        });

        this.gui.add(grid);

        for (const puzzle of collections[collection_name]) {
            const json = puzzle();
            const name = json.name;
            const puzzle_btn = new GUIPuzzleCard({
                puzzle: json,
                width: '23%',
                max_width: 300,
                min_width: 150,
                text: name,
                margin_left: 2,
                margin_right: 2,
                margin_bottom: 2,
                margin_top: 2
            });

            puzzle_btn.onClick(() => {
                PicrossGame.getInstance().changeScreen(ScreenType.PUZZLE, {
                    puzzle: PicrossPuzzle.fromJSON(json),
                    from_hint_editor: false
                });
            });

            grid.add(puzzle_btn);
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