import { ShapeJSON } from "../../../../../PicrossShape";

export interface EditorScreenState {
    options_modal_open: boolean,
    shape: ShapeJSON
}

export const TOGGLE_EDITOR_OPTIONS_MODAL = 'TOGGLE_EDITOR_OPTIONS_MODAL';
export const SET_EDITOR_SHAPE = 'SET_EDITOR_SHAPE';

export interface ToggleEditorOptionsModalAction {
    type: typeof TOGGLE_EDITOR_OPTIONS_MODAL
}

export interface SetEditorShapeAction {
    type: typeof SET_EDITOR_SHAPE,
    shape: ShapeJSON
}

export type EditorScreenActions = ToggleEditorOptionsModalAction | SetEditorShapeAction;