import { SetEditorShapeAction, ToggleEditorOptionsModalAction, TOGGLE_EDITOR_OPTIONS_MODAL, SET_EDITOR_SHAPE } from "./types";
import { ShapeJSON } from "../../../../../PicrossShape";

export function toggleEditorOptionsModal(): ToggleEditorOptionsModalAction {
    return {
        type: TOGGLE_EDITOR_OPTIONS_MODAL
    };
}

export function setEditorShape(shape: ShapeJSON): SetEditorShapeAction {
    return {
        type: SET_EDITOR_SHAPE,
        shape
    };
}