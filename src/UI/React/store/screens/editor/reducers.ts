import { EditorScreenActions, EditorScreenState, TOGGLE_EDITOR_OPTIONS_MODAL, SET_EDITOR_SHAPE, IS_GENERATING_PUZZLE } from "./types";
import { ShapeJSON } from "../../../../../PicrossShape";

const defaultEditorScreenState: EditorScreenState = {
    options_modal_open: false,
    shape: null,
    generating_puzzle: false
};

function toggleModalReducer(
    state = defaultEditorScreenState.options_modal_open,
    action: EditorScreenActions
): boolean {

    if (action.type === TOGGLE_EDITOR_OPTIONS_MODAL) {
        return !state;
    }

    return state;
}

function setShapeReducer(
    state = defaultEditorScreenState.shape,
    action: EditorScreenActions
): ShapeJSON {

    if (action.type === SET_EDITOR_SHAPE) {
        return action.shape;
    }

    return state;
}

function isGeneratingPuzzleReducer(
    state = defaultEditorScreenState.generating_puzzle,
    action: EditorScreenActions
): boolean {
    if (action.type === IS_GENERATING_PUZZLE) {
        return action.generating;
    }

    return state;
}

export function editorScreenReducer(
    state = defaultEditorScreenState,
    action: EditorScreenActions
): EditorScreenState {

    return {
        options_modal_open: toggleModalReducer(state.options_modal_open, action),
        shape: setShapeReducer(state.shape, action),
        generating_puzzle: isGeneratingPuzzleReducer(state.generating_puzzle, action)
    };
}