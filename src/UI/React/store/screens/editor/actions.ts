import { SetEditorShapeAction, ToggleEditorOptionsModalAction, TOGGLE_EDITOR_OPTIONS_MODAL, SET_EDITOR_SHAPE, IsGeneratingPuzzleAction, IS_GENERATING_PUZZLE } from "./types";
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

export function isGeneratingPuzzle(generating: boolean): IsGeneratingPuzzleAction {
    return {
        type: IS_GENERATING_PUZZLE,
        generating
    };
}