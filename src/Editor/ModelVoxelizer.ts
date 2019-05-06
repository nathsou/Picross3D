import { Box3, BufferGeometry, Color, Group, Mesh, MeshPhongMaterial, Triangle, Vector3 } from "three";
import OBJLoader from "../OBJLoader";
import { CellState, PicrossShape } from "../PicrossShape";
import { boundingBox, Box, floorStep } from "../Utils/Utils";

export namespace ModelVoxelizer {

    function triangleBoundingBox(tri: Triangle): Box {
        const from = [
            Math.floor(Math.min(tri.a.x, tri.b.x, tri.c.x)),
            Math.floor(Math.min(tri.a.y, tri.b.y, tri.c.y)),
            Math.floor(Math.min(tri.a.z, tri.b.z, tri.c.z))
        ];

        const to = [
            Math.ceil(Math.max(tri.a.x, tri.b.x, tri.c.x)),
            Math.ceil(Math.max(tri.a.y, tri.b.y, tri.c.y)),
            Math.ceil(Math.max(tri.a.z, tri.b.z, tri.c.z))
        ];

        return boundingBox(from, to);
    }

    function voxelIntersectsTriangle(i: number, j: number, k: number, tri: Triangle): boolean {
        const box = new Box3(new Vector3(i, j, k), new Vector3(i + 1, j + 1, k + 1));

        ///@ts-ignore
        return tri.intersectsBox(box);
    }

    function fillShape(shape: PicrossShape, boundaries: { min: number, max: number }[][][]): void {

        console.log(boundaries);

        for (let i = 0; i < shape.dims[0]; i++) {
            for (let j = 0; j < shape.dims[1]; j++) {
                for (let b of boundaries[i][j]) {
                    for (let k = b.min; k <= b.max; k++) {
                        shape.setCell(i, j, k, CellState.unknown);
                    }
                }
            }
        }
    }

    //TODO: Optimize (change datastructures)
    export function voxelize(
        positions: Float32Array,
        offset: number[],
        shape: PicrossShape,
        scale = 1
    ): void {

        const boundaries: { min: number, max: number, blank: boolean }[][][] = [];

        for (let i = 0; i < shape.dims[0]; i++) {
            boundaries.push([]);
            for (let j = 0; j < shape.dims[1]; j++) {
                boundaries[i].push([{
                    min: shape.dims[2],
                    max: 0,
                    blank: false
                }]);
            }
        }

        for (let p = 0; p < positions.length; p += 9) {
            const triangle = new Triangle(
                new Vector3(
                    offset[0] + positions[p] * scale,
                    offset[1] + positions[p + 1] * scale,
                    offset[2] + positions[p + 2] * scale
                ),
                new Vector3(
                    offset[0] + positions[p + 3] * scale,
                    offset[1] + positions[p + 4] * scale,
                    offset[2] + positions[p + 5] * scale
                ),
                new Vector3(
                    offset[0] + positions[p + 6] * scale,
                    offset[1] + positions[p + 7] * scale,
                    offset[2] + positions[p + 8] * scale
                )
            );

            const box = triangleBoundingBox(triangle);

            // const normal = new Vector3();
            // triangle.getNormal(normal);

            // check each voxel in the triangle's bounding box
            for (let i = box.start[0]; i < box.start[0] + box.dims[0]; i++) {
                for (let j = box.start[1]; j < box.start[1] + box.dims[1]; j++) {
                    let fill = false;
                    for (let k = box.start[2]; k < box.start[2] + box.dims[2]; k++) {
                        if (i >= shape.dims[0] || j >= shape.dims[1] || k >= shape.dims[2]) {
                            continue;
                        }

                        // if (i < 0) { debugger };

                        if (
                            shape.getCell(i, j, k) !== CellState.unknown &&
                            voxelIntersectsTriangle(i, j, k, triangle)
                        ) {
                            shape.setCell(i, j, k, CellState.unknown);
                            const boundary = boundaries[i][j][boundaries[i][j].length - 1];

                            fill = true;
                            if (boundary.blank) {
                                boundaries[i][j].push({
                                    min: k,
                                    max: k,
                                    blank: false
                                });
                                continue;
                            }

                            if (k < boundary.min) {
                                boundary.min = k;
                            }

                            if (k > boundary.max) {
                                boundary.max = k;
                            }

                        } else if (fill) {
                            boundaries[i][j][boundaries[i][j].length - 1].blank = true;
                        }
                    }
                }
            }
        }

        fillShape(shape, boundaries);

    }

    export function load(uri: string, shape: PicrossShape, on_progress?: (prog: ProgressEvent) => void): Promise<void> {
        const center = new Vector3(
            shape.dims[0] / 2,
            0,
            shape.dims[1] / 2
        );

        return new Promise((resolve, reject) => {
            new OBJLoader().load(uri, (group: Group) => {
                for (let mesh of group.children) {
                    const geometry = (mesh as Mesh).geometry;
                    geometry.computeBoundingBox();
                    const max_dim = Math.max(...shape.dims);

                    const diff = geometry.boundingBox.max.clone().sub(geometry.boundingBox.min).toArray();

                    const scale_factor = floorStep(max_dim / Math.max(...diff), 1 / max_dim);

                    console.log(geometry.boundingBox);
                    console.log('max - min', diff);
                    console.log('scale', scale_factor);
                    console.log('maxd * s', geometry.boundingBox.max.toArray().map(d => d * scale_factor));
                    console.log('mind * s', geometry.boundingBox.min.toArray().map(d => d * scale_factor));

                    mesh.position.y = -geometry.boundingBox.min.y * scale_factor;
                    mesh.scale.set(scale_factor, scale_factor, scale_factor);
                    ((mesh as Mesh).material as MeshPhongMaterial).color = new Color('#cf00fc');


                    console.log('mesh pos', mesh.position);
                    console.log('max + min', geometry.boundingBox.max.clone()
                        .add(geometry.boundingBox.min));

                    // FIXME:
                    const offset = center.clone()
                        .sub(mesh.position)
                        .sub(
                            geometry.boundingBox.max.clone()
                                .add(geometry.boundingBox.min)
                                .multiplyScalar(scale_factor)
                        );

                    console.log('center', center);
                    offset.y = mesh.position.y;
                    console.log('offset', offset);
                    console.log(geometry.boundingBox.max.toArray().map((d, i) => offset.toArray()[i] + d * scale_factor))
                    console.log(geometry.boundingBox.min.toArray().map((d, i) => offset.toArray()[i] + d * scale_factor))

                    console.log(geometry.boundingBox.max.clone()
                        .add(geometry.boundingBox.min)
                        .multiplyScalar(scale_factor));

                    console.time('voxelize');

                    ModelVoxelizer.voxelize(
                        ((mesh as Mesh).geometry as BufferGeometry).attributes['position'].array as Float32Array,
                        offset.toArray(),
                        shape,
                        scale_factor
                    );

                    console.timeEnd('voxelize');
                }


                // group.position.copy(center);
                // this.renderer.addObject3D(group);

                resolve();

            }, on_progress,
                reject
            );
        });
    }

}
