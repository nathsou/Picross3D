import { Mesh, MeshBasicMaterial, NearestFilter, OrthographicCamera, PlaneGeometry, Scene, Texture, WebGLRenderer } from "three";
import { Disposable } from "../Screens/Screen";
import { GUIComponent, GUIEventType, Point } from "./GUIComponent";

export class GUI implements Disposable {

    private scene: Scene;
    private camera: OrthographicCamera;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D
    private width: number;
    private height: number;
    private texture: Texture;
    private components: GUIComponent[];
    private three_renderer: WebGLRenderer;
    private needs_rerender = true;
    private clear_color = '#00000000';
    private event_listeners: Map<string, (e: MouseEvent | KeyboardEvent) => void>;
    private dpr: number;

    constructor(width: number, height: number, three_renderer: WebGLRenderer) {
        this.width = width;
        this.height = height;
        this.three_renderer = three_renderer;

        this.canvas = document.createElement('canvas');
        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.dpr, this.dpr);

        this.camera = new OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 0, 30);
        this.scene = new Scene();

        this.texture = new Texture(this.canvas)
        this.texture.needsUpdate = true;
        this.texture.magFilter = NearestFilter;
        this.texture.minFilter = NearestFilter;

        const material = new MeshBasicMaterial({ map: this.texture, transparent: true });

        const planeGeometry = new PlaneGeometry(this.width, this.height);
        const plane = new Mesh(planeGeometry, material);
        this.scene.add(plane);

        this.components = [];
        this.initEventHandlers();

        window.addEventListener('resize', () => {
            this.onResize(window.innerWidth, window.innerHeight);
        });
    }

    public onResize(width: number, height: number): void {
        this.three_renderer.setSize(width, height);
        this.camera.updateProjectionMatrix();
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx.scale(this.dpr, this.dpr);

        for (const comp of this.components) {
            comp.resize({ width, height });
        }

        this.texture.needsUpdate = true;
        this.needs_rerender = true;
    }

    private initEventHandlers(): void {
        this.event_listeners = new Map<string, (e: MouseEvent | KeyboardEvent) => void>();

        this.event_listeners.set('mousedown', (e: MouseEvent) => this.onMouseDown(e));
        this.event_listeners.set('mouseup', (e: MouseEvent) => this.onMouseUp(e));
        this.event_listeners.set('mousemove', (e: MouseEvent) => this.onMouseMove(e));
        this.event_listeners.set('click', (e: MouseEvent) => this.onClick(e));

        for (const [event, listener] of this.event_listeners) {
            window.addEventListener(event, listener);
        }
    }

    private onMouseDown(ev: MouseEvent): void {
        this.triggerEvent(GUIEventType.MOUSE_DOWN, { x: ev.x, y: ev.y });
        ev.preventDefault();
    }

    private onMouseUp(ev: MouseEvent): void {
        this.triggerEvent(GUIEventType.MOUSE_UP, { x: ev.x, y: ev.y }, true);
        ev.preventDefault();
    }

    private onMouseMove(ev: MouseEvent): void {
        this.triggerEvent(GUIEventType.MOUSE_MOVE, { x: ev.x, y: ev.y });
        ev.preventDefault();
    }

    private onClick(ev: MouseEvent): void {
        this.triggerEvent(GUIEventType.CLICK, { x: ev.x, y: ev.y });
        ev.preventDefault();
    }

    public dispose(): void {

        for (const [event, listener] of this.event_listeners) {
            window.removeEventListener(event, listener);
        }

        this.event_listeners.clear();

        for (const comp of this.components) {
            comp.dispose();
        }
    }

    private triggerEvent(type: GUIEventType, pos: Point, force_intersection_check = false): void {
        for (const component of this.components) {
            component.triggerEvent(type, pos, force_intersection_check);
        }
    }

    public add(...components: GUIComponent[]): void {
        this.components.push(...components);
    }

    public update(): boolean {
        let updated = false;

        if (this.needs_rerender) {
            updated = true;
        } else {
            for (const component of this.components) {
                updated = component.needsReRender() || updated;
            }
        }

        if (updated) {
            this.texture.needsUpdate = true;
        }

        return updated;
    }

    public render(): void {
        if (this.clear_color !== '#00000000') {
            this.ctx.fillStyle = this.clear_color;
            this.ctx.fillRect(0, 0, this.width, this.height);
        } else {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
        for (const component of this.components) {
            component.render(this.ctx);
        }

        this.three_renderer.render(this.scene, this.camera);
        this.needs_rerender = false;
    }

    public setClearColor(color: string): void {
        this.clear_color = color;
    }
}