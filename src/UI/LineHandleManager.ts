import { Raycaster, Vector2, Camera, Vector3, Euler, Mesh, PlaneBufferGeometry, DoubleSide, MeshBasicMaterial, Light, AmbientLight, DirectionalLight, Color } from "three";
import { LineSelectorHandle } from "./LineSelectorHandle";
import EventEmitter from "../Utils/EventEmitter";
import { LineDirection } from "../PicrossShape";
import { OrbitControls } from "../OrbitControls";

export interface LineRange {
    from: number,
    to: number
}

export class LineHandleManager extends EventEmitter {

    private dims: number[];
    private raycaster: Raycaster;
    private controls: OrbitControls;
    private radius = 0.5;
    private handles: {
        row: LineSelectorHandle,
        depth: LineSelectorHandle
    };

    constructor(dims: number[], raycaster: Raycaster, controls: OrbitControls) {
        super();
        this.raycaster = raycaster;
        this.controls = controls;
        this.dims = dims;

        // planes

        // Plane, that helps to determinate an intersection position
        const row_plane = new Mesh(
            new PlaneBufferGeometry(dims[0], dims[1], 1, 1),
            new MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false, side: DoubleSide })
        );

        row_plane.position.set(
            dims[0] / 2 + 3 * this.radius,
            dims[1] / 2,
            0
        );

        const col_plane = new Mesh(
            new PlaneBufferGeometry(dims[2], dims[1], 1, 1),
            new MeshBasicMaterial({ color: 0x0000ff, wireframe: true, visible: false, side: DoubleSide })
        );

        col_plane.rotateY(-Math.PI / 2);

        col_plane.position.set(
            0,
            dims[1] / 2,
            dims[2] / 2 + 3 * this.radius
        );


        this.handles = {
            row: new LineSelectorHandle(new Vector3(
                dims[0] + 1,
                dims[1] / 2,
                0,
            ),
                LineDirection.row,
                row_plane,
                dims[0],
                dims[2],
                this.radius
            ),

            depth: new LineSelectorHandle(new Vector3(
                0,
                dims[1] / 2,
                dims[2] + 1
            ),
                LineDirection.col,
                col_plane,
                dims[0],
                dims[2],
                this.radius
            )
        };

        this.handles.row.on('hide_line', nb_hidden_rows => this.onHideRow(nb_hidden_rows));
        this.handles.depth.on('hide_line', nb_hidden_depths => this.onHideDepth(nb_hidden_depths));
    }

    public hideHandles(): void {
        this.handles.row.hide();
        this.handles.depth.hide();
    }

    private onHideRow(nb_hidden_rows: number): void {

        if (nb_hidden_rows === 0) {
            this.handles.depth.show();
        } else {
            this.handles.depth.hide();
        }

        if (nb_hidden_rows <= 0) {
            nb_hidden_rows = this.dims[0] + nb_hidden_rows;
            // don't hide the last line
            nb_hidden_rows = Math.max(nb_hidden_rows, 1);

            this.emit('hide_rows', {
                from: nb_hidden_rows,
                to: this.dims[0]
            });

            this.emit('show_rows', {
                from: 0,
                to: nb_hidden_rows
            });

        } else {
            this.emit('show_rows', {
                from: nb_hidden_rows,
                to: this.dims[0]
            });

            this.emit('hide_rows', {
                from: 0,
                to: Math.min(nb_hidden_rows, this.dims[0] - 1)
            });
        }
    }

    private onHideDepth(nb_hidden_depths: number): void {
        if (nb_hidden_depths === 0) {
            this.handles.row.show();
        } else {
            this.handles.row.hide();
        }

        if (nb_hidden_depths <= 0) {
            nb_hidden_depths = this.dims[2] + nb_hidden_depths;
            // don't hide the last line
            nb_hidden_depths = Math.max(nb_hidden_depths, 1);

            this.emit('hide_depths', {
                from: nb_hidden_depths,
                to: this.dims[2]
            });

            this.emit('show_depths', {
                from: 0,
                to: nb_hidden_depths
            });

        } else {
            this.emit('show_depths', {
                from: nb_hidden_depths,
                to: this.dims[2]
            });

            this.emit('hide_depths', {
                from: 0,
                to: Math.min(nb_hidden_depths, this.dims[2] - 1)
            });
        }
    }

    public onMouseMove(): void {
        if (this.handles.row.mouseDown) {
            const plane_inter = this.raycaster.intersectObject(this.handles.row.plane);
            if (plane_inter.length !== 0) {
                this.handles.row.onMouseMove(plane_inter[0].point);
            }
        } else if (this.handles.depth.mouseDown) {
            const plane_inter = this.raycaster.intersectObject(this.handles.depth.plane);
            if (plane_inter.length !== 0) {
                this.handles.depth.onMouseMove(plane_inter[0].point);
            }
        }
    }

    public onMouseDown(mouse: Vector2, camera: Camera): void {
        this.raycaster.setFromCamera(mouse, camera);

        const inter = this.raycaster.intersectObjects([
            this.handles.row.mesh,
            this.handles.depth.mesh
        ]);

        if (inter.length !== 0) {
            this.controls.enabled = false;
            if (inter[0].object === this.handles.row.mesh) {
                const plane_inter = this.raycaster.intersectObject(this.handles.row.plane);
                if (plane_inter.length !== 0) {
                    const offset = plane_inter[0].point.clone().sub(plane_inter[0].object.position);
                    this.handles.row.onMouseDown(offset);
                }
            } else if (inter[0].object === this.handles.depth.mesh) {
                const plane_inter = this.raycaster.intersectObject(this.handles.depth.plane);
                if (plane_inter.length !== 0) {
                    const offset = plane_inter[0].point.clone().sub(plane_inter[0].object.position);
                    this.handles.depth.onMouseDown(offset);
                }
            }
        }
    }

    public onMouseUp(): void {
        this.controls.enabled = true;
        if (this.handles.row.mouseDown) {
            this.handles.row.onMouseUp();
        } else if (this.handles.depth.mouseDown) {
            this.handles.depth.onMouseUp();
        }
    }

    public onClick(): void {
        if (this.handles.row.hovered) {
            this.handles.row.onClick();
        } else if (this.handles.depth.hovered) {
            this.handles.depth.onClick();
        }
    }

    // returns whether a handle is hovered
    public rayCast(mouse: Vector2, camera: Camera): boolean {

        this.raycaster.setFromCamera(mouse, camera);

        const intersections = this.raycaster.intersectObjects([
            this.handles.row.mesh,
            this.handles.depth.mesh
        ]);

        if (intersections.length > 0) {
            const inter = intersections[0];

            if (inter.object === this.handles.row.mesh) { // row handle is hovered
                this.handles.row.onHover();
            } else { // col handle is hovered
                this.handles.depth.onHover();
            }
        } else { // no handle hovered
            if (this.handles.row.hovered) {
                this.handles.row.onHoverEnd();
            } else if (this.handles.depth.hovered) {
                this.handles.depth.onHoverEnd();
            }
        }

        return intersections.length > 0;
    }

    public update(camera_rotation: Euler): void {

        const sideX = camera_rotation.z < 0 ? -1 : 1;
        const sideZ =
            ((camera_rotation.z < 0 && camera_rotation.z < -Math.PI / 2) ||
                (camera_rotation.z > 0 && camera_rotation.z > Math.PI / 2))
                ? -1 : 1;

        this.handles.row.setSide(sideX, sideZ);
        this.handles.depth.setSide(sideX, sideZ);
    }

    public getMeshes(): Mesh[] {
        return [
            this.handles.row.mesh,
            this.handles.row.plane,
            this.handles.depth.mesh,
            this.handles.depth.plane
        ];
    }
}