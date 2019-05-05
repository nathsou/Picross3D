import { Material, Mesh, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { CellState } from "./PicrossShape";

export abstract class CellSetRenderer {

    protected _scene: Scene;
    protected _camera: PerspectiveCamera;
    protected _three_renderer: WebGLRenderer;
    protected needs_rerender = true;

    constructor(canvas: HTMLCanvasElement) {
        this._scene = new Scene();
        this._camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        window.addEventListener('resize', () => this.onResize());

        this._three_renderer = new WebGLRenderer({ antialias: true, canvas });
        this._three_renderer.setPixelRatio(window.devicePixelRatio);
        this._three_renderer.setSize(window.innerWidth, window.innerHeight);
    }

    protected onResize(): void {
        this._three_renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this.needsReRender();
    }

    public addObject3D(...obj: Object3D[]): void {
        this._scene.add(...obj);
    }

    public removeObject3D(...obj: Object3D[]): void {
        this._scene.remove(...obj);
    }

    public addCell(cell: Mesh): void {
        this._scene.add(cell);
    }

    public removeCell(cell: Mesh): void {
        this._scene.remove(cell);
    }

    public abstract getCellMaterials(i: number, j: number, k: number, state: CellState): Material[];

    public needsReRender(): void {
        this.needs_rerender = true;
    }

    public render(): boolean {
        if (this.needs_rerender) {
            this._three_renderer.render(this._scene, this._camera);
            this.needs_rerender = false;
            return true;
        }

        return false;
    }

    //getters

    public get domElement(): HTMLCanvasElement {
        return this._three_renderer.domElement;
    }
    public get camera(): PerspectiveCamera {
        return this._camera;
    }

    public get threeRenderer(): WebGLRenderer {
        return this._three_renderer;
    }
}