import { Raycaster, Vector2 } from "three";
import { CellMeshSet } from "./CellMeshSet";
import { CellSelection } from "./CellSelection";
import { CellSetRenderer } from "./CellSetRenderer";
import { OrbitControls } from "./OrbitControls";
import { PicrossShape } from "./PicrossShape";
import { Disposable } from "./Screens/Screen";
import { LineHandleManager, LineRange } from "./UI/LineHandleManager";
import { PicrossGame } from "./PicrossGame";

export interface Action {
    key: string,
    selected: boolean
}

export interface PicrossActions {
    [index: string]: Action
    brush: Action,
    hammer: Action,
    builder: Action
}

export abstract class PicrossController implements Disposable {

    protected cells: CellMeshSet;
    protected shape: PicrossShape;
    protected renderer: CellSetRenderer;
    protected handles_manager: LineHandleManager;
    protected raycaster: Raycaster;
    protected orbit_controls: OrbitControls;
    protected mouse: Vector2;
    protected mouse_down = false;
    protected selection: CellSelection;
    protected needs_recast = true;
    protected actions: PicrossActions;
    protected event_listeners: Map<string, (e: MouseEvent | KeyboardEvent) => void>;
    protected paused = false;

    constructor(renderer: CellSetRenderer, shape: PicrossShape, handles = true, normals = false) {
        this.renderer = renderer;
        this.shape = shape;
        this.cells = new CellMeshSet(shape, renderer, normals);


        const controls = PicrossGame.getInstance().controls;

        this.actions = {
            hammer: { key: controls.hammer, selected: false },
            brush: { key: controls.brush, selected: false },
            builder: { key: controls.builder, selected: false },
        };

        this.mouse = new Vector2();
        this.raycaster = new Raycaster();
        this.selection = new CellSelection(this.cells);

        this.orbit_controls = new OrbitControls(this.renderer.camera, this.renderer.domElement);
        this.orbit_controls.addEventListener('change', () => this.renderer.needsReRender());

        this.orbit_controls.enableKeys = false;
        this.orbit_controls.target.set(
            this.shape.dims[0] / 2,
            this.shape.dims[1] / 2,
            this.shape.dims[2] / 2
        );

        // line selection handles
        if (handles && this.shape.dims[2] > 1) {
            this.handles_manager = new LineHandleManager(
                this.shape.dims,
                this.raycaster,
                this.orbit_controls
            );

            this.renderer.addObject3D(...this.handles_manager.getMeshes());

            this.handles_manager.on('hide_rows', (rows: LineRange) => this.onHideRows(rows));
            this.handles_manager.on('show_rows', (rows: LineRange) => this.onShowRows(rows));
            this.handles_manager.on('hide_depths', (depths: LineRange) => this.onHideDepths(depths));
            this.handles_manager.on('show_depths', (depths: LineRange) => this.onShowDepths(depths));
        }

        this.cells.generateMeshes();

        this.renderer.addObject3D(...this.selection.getObjects());

        this.initEventListeners();
    }

    protected initEventListeners(): void {
        this.event_listeners = new Map<string, (e: MouseEvent) => void>();
        this.event_listeners.set('mousemove', (e: MouseEvent) => this.onMouseMove(e));
        this.event_listeners.set('mousedown', (e: MouseEvent) => this.onMouseDown(e));
        this.event_listeners.set('mouseup', (e: MouseEvent) => this.onMouseUp(e));
        this.event_listeners.set('click', (e: MouseEvent) => this.onClick(e));
        this.event_listeners.set('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
        this.event_listeners.set('keyup', (e: KeyboardEvent) => this.onKeyUp(e));

        for (const [event, listener] of this.event_listeners) {
            this.renderer.domElement.addEventListener(event, listener);
        }
    }

    public dispose(): void {
        for (const [event, listener] of this.event_listeners) {
            this.renderer.domElement.removeEventListener(event, listener);
        }

        this.event_listeners.clear();
        if (this.handles_manager !== undefined) {
            this.handles_manager.removeListeners();
        }
    }

    protected onHideRows(rows: LineRange): void {
        this.cells.hideRows(rows);
        this.renderer.needsReRender();
    }

    protected onShowRows(rows: LineRange): void {
        this.cells.showRows(rows);
        this.renderer.needsReRender();
    }

    protected onHideDepths(depths: LineRange): void {
        this.cells.hideDepths(depths);
        this.renderer.needsReRender();
    }

    protected onShowDepths(depths: LineRange): void {
        this.cells.showDepths(depths);
        this.renderer.needsReRender();
    }

    protected onKeyDown(e: KeyboardEvent): void {

        for (const action in this.actions) {
            if (e.code === this.actions[action].key) {
                this.renderer.needsReRender();
                this.orbit_controls.enableRotate = false;
                this.actions[action].selected = true;
                break;
            }
        }

    }

    protected onKeyUp(e: KeyboardEvent): void {

        for (const action in this.actions) {
            if (e.code === this.actions[action].key) {
                this.orbit_controls.enableRotate = true;
                this.selection.hideSelection();
                this.renderer.needsReRender();
                this.actions[action].selected = false;
                break;
            }
        }
    }

    protected onMouseMove(e: MouseEvent): void {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.handleSelection();

        if (this.handles_manager) {
            this.handles_manager.onMouseMove();
        }

        this.renderer.needsReRender();
        this.needs_recast = true;
    }

    protected onMouseDown(e: MouseEvent): void {
        this.mouse_down = true;
        this.selection.onMouseDown();

        if (this.handles_manager) {
            this.handles_manager.onMouseDown(this.mouse, this.renderer.camera);
        }
    }

    protected onMouseUp(e: MouseEvent): void {
        this.mouse_down = false;

        if (this.actions.hammer || this.actions.brush) {
            this.selection.onMouseUp(this.actions);
            this.renderer.needsReRender();
        }

        if (this.handles_manager) {
            this.handles_manager.onMouseUp();
        }
    }

    protected onClick(e: MouseEvent): void {
        if (this.handles_manager) {
            this.handles_manager.onClick();
        }
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

        const coords = this.cells.rayCast(this.raycaster, this.actions.builder.selected).pos;

        this.selection.setHoveredCell(coords);
        this.handleSelection();

        this.needs_recast = false;

        return coords;
    }

    protected handleSelection(): void {
        this.selection.handleSelection(this.mouse_down, this.actions);
        this.renderer.needsReRender();
    }

    protected update(): void {
        if (this.paused) return;

        this.orbit_controls.update();
        this.cells.update();
        this.rayCast();

        const coords = this.rayCast();
        if (coords !== null) {
            this.selection.setHoveredCell(coords);
            this.handleSelection();
        }

        if (this.handles_manager) {
            this.handles_manager.update(this.renderer.camera.rotation);
        }
    }

    protected render(): void {
        this.renderer.render();
    }

    public start(): void {
        this.renderer.threeRenderer.setAnimationLoop(() => {
            this.update();
            this.render();
        });
    }

    protected restore(): void {
        for (const { coords } of this.shape.history) {
            this.cells.addToQueue(coords[0], coords[1], coords[2]);
            this.cells.updateEdges(coords[0], coords[1], coords[2]);
            this.cells.updateNeighbors(coords[0], coords[1], coords[2]);
        }

        this.shape.restore();
    }
}