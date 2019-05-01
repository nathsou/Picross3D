import { WebGLRenderer } from "three";
import { CollectionDetailsScreen, CollectionDetailsScreenData } from "./Screens/CollectionDetailsScreen";
import { EditorScreen } from "./Screens/EditorScreen";
import { MenuScreen } from "./Screens/MenuScreen";
import { PuzzleScreen, PuzzleScreenData } from "./Screens/PuzzleScreen";
import { PuzzleSelectionScreen } from "./Screens/PuzzleSelectionScreen";
import { Screen, ScreenData } from "./Screens/Screen";
import { SettingsScreen } from "./Screens/SettingsScreen";
import { HintEditorScreen } from "./Screens/HintEditorScreen";

export enum ScreenType {
    MENU,
    PUZZLE_SELECTION,
    COLLECTION_DETAILS,
    PUZZLE,
    EDITOR,
    SETTINGS,
    HINT_EDITOR
}

export interface PicrossControls {
    hammer: KeyboardEvent['key'],
    brush: KeyboardEvent['key'],
    builder: KeyboardEvent['key']
}

export class PicrossGame {

    private static instance: PicrossGame;
    private screen: Screen;
    private three_renderer: WebGLRenderer;
    public controls: PicrossControls;

    private constructor() {
        const renderer = new WebGLRenderer({ antialias: true });
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
        // make the canvas 'focused' for keydown and keyup events
        renderer.domElement.tabIndex = 1;
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.three_renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false;
        // three_renderer.vr.enabled = true;
        // document.body.appendChild(WEBVR.createButton(three_renderer));

        this.initControls();
        this.changeScreen(ScreenType.MENU, {});
        // this.screen = new DebugScreen(renderer, {});

        this.startRenderLoop();
    }

    private initControls(): void {
        this.controls = {
            hammer: 'KeyW',
            brush: 'KeyA',
            builder: 'KeyQ'
        };
    }

    public static getInstance(): PicrossGame {

        if (PicrossGame.instance === undefined) {
            PicrossGame.instance = new PicrossGame();
        }

        return PicrossGame.instance;
    }

    public changeScreen(type: ScreenType, data: ScreenData): void {

        if (this.screen !== undefined) {
            this.screen.dispose();
        }

        switch (type) {

            case ScreenType.MENU:
                this.screen = new MenuScreen(this.three_renderer, data);
                break;

            case ScreenType.PUZZLE_SELECTION:
                this.screen = new PuzzleSelectionScreen(this.three_renderer, data);
                break;

            case ScreenType.COLLECTION_DETAILS:
                this.screen = new CollectionDetailsScreen(this.three_renderer, data as CollectionDetailsScreenData);
                break;

            case ScreenType.PUZZLE:
                this.screen = new PuzzleScreen(this.three_renderer, data as PuzzleScreenData);
                break;

            case ScreenType.EDITOR:
                this.screen = new EditorScreen(this.three_renderer, data);
                break;

            case ScreenType.SETTINGS:
                this.screen = new SettingsScreen(this.three_renderer, data);
                break;

            case ScreenType.HINT_EDITOR:
                this.screen = new HintEditorScreen(this.three_renderer, data as PuzzleScreenData);
                break;

            default:
                throw new Error(`Unknown ScreenType: ${ScreenType[type]}`);
        }

        this.startRenderLoop();
    }

    private startRenderLoop(): void {
        this.screen.startRenderLoop();
    }

    public get domElement(): HTMLCanvasElement {
        return this.three_renderer.domElement;
    }

    public get width(): number {
        return this.domElement.width;
    }

    public get height(): number {
        return this.domElement.height;
    }

}