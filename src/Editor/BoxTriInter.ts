import { WebGLRenderer, Scene, PerspectiveCamera, GridHelper, BoxGeometry, Mesh, MeshNormalMaterial } from "three";
import { OrbitControls } from "../OrbitControls";

export class Debug {

    private renderer: WebGLRenderer;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private orbit_controls: OrbitControls;

    constructor(renderer: WebGLRenderer) {
        this.renderer = renderer;
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.y = 7;
        this.camera.position.z = -10;

        this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit_controls.enableKeys = false;
        this.orbit_controls.target.set(0, 0, 0);

        const box = new BoxGeometry(1, 1, 1, 1, 1, 1);

        this.scene.add(
            new GridHelper(10, 10, 0xffffff, 0xababab),
            new Mesh(
                box,
                new MeshNormalMaterial()
            )
        );
    }

    public update(): void {
        this.orbit_controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    public start(): void {
        this.renderer.setAnimationLoop(() => {
            this.update();
        });
    }
}