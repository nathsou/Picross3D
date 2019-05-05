import { HintEditorScreenState, HintEditorScreenActions, TOGGLE_HINT_EDITOR_OPTIONS_MODAL, SET_HINT_EDITOR_PUZZLE } from "./types";
import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";

export const defaultHintEditorScreenState: HintEditorScreenState = {
    options_modal_open: false,
    puzzle: null
};

function toggleModalReducer(
    state = defaultHintEditorScreenState.options_modal_open,
    action: HintEditorScreenActions
): boolean {

    if (action.type === TOGGLE_HINT_EDITOR_OPTIONS_MODAL) {
        return !state;
    }

    return state;
}

function puzzleReducer(
    state = defaultHintEditorScreenState.puzzle,
    action: HintEditorScreenActions
): PuzzleJSON {
    if (action.type === SET_HINT_EDITOR_PUZZLE) {
        return action.puzzle;
    }

    return state;
}

export function hintEditorScreenReducer(
    state = defaultHintEditorScreenState,
    action: HintEditorScreenActions
): HintEditorScreenState {

    return {
        options_modal_open: toggleModalReducer(state.options_modal_open, action),
        puzzle: puzzleReducer(state.puzzle, action)
    };
}