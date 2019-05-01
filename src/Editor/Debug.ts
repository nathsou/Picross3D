import { WebGLRenderer, Scene, PerspectiveCamera, GridHelper, BoxGeometry, Mesh, MeshNormalMaterial, MeshBasicMaterial } from "three";
import { OrbitControls } from "../OrbitControls";
import { PuzzleRenderer } from "../Puzzle/PuzzleRenderer";
import { PicrossPuzzle } from "../Puzzle/PicrossPuzzle";
import { puzzles } from "../Puzzle/Puzzles";
import { CellMeshSet } from "../CellMeshSet";

export class Debug {

    private renderer: PuzzleRenderer;
    private three_renderer: WebGLRenderer;

    constructor(three_renderer: WebGLRenderer) {

        this.three_renderer = three_renderer;
        const width = window.innerWidth;
        const height = window.innerHeight;

        const cnv = document.createElement('canvas');
        cnv.width = width;
        cnv.height = height;
        // const renderer = new WebGLRenderer({ canvas: cnv });
        const puzzle = PicrossPuzzle.fromJSON(puzzles.horse());
        three_renderer.setSize(width, height);
        this.renderer = new PuzzleRenderer(puzzle, three_renderer);
        const mesh = new CellMeshSet(puzzle.shape, this.renderer, false);
        console.log(this.renderer.camera.position);
        this.renderer.camera.position.set(puzzle.dims[0] / 2, puzzle.dims[1] / 2, 12);
        mesh.generateMeshes();
        mesh.update();
        this.renderer.needsReRender();
        this.renderer.render();
        console.log(mesh.cellCount);
        //Vector3 {x: 7.500000000000001, y: 9.000000000000002, z: 12.990381056766578} Euler {_x: -0.6058911188392465, _y: 0.4431047804298209, _z: 0.2887429079540021, _order: "XYZ", onChangeCallback: ƒ}
    }

    public update(): void {
        this.renderer.render();
    }

    public start(): void {
        this.three_renderer.setAnimationLoop(() => {
            this.update();
        });
    }
}