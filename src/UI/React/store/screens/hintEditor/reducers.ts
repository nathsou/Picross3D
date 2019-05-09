import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";
import { HintEditorScreenActions, HintEditorScreenState, SET_HINT_EDITOR_PUZZLE, TOGGLE_HINT_EDITOR_EXPORT_MODAL, TOGGLE_HINT_EDITOR_OPTIONS_MODAL, SET_HINT_EDITOR_PUZZLE_NAME } from "./types";

export const defaultHintEditorScreenState: HintEditorScreenState = {
    options_modal_open: false,
    export_modal_open: false,
    puzzle_name: 'Untitled Puzzle',
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

function toggleExportModalReducer(
    state = defaultHintEditorScreenState.export_modal_open,
    action: HintEditorScreenActions
): boolean {

    if (action.type === TOGGLE_HINT_EDITOR_EXPORT_MODAL) {
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

function puzzleNameReducer(
    state = defaultHintEditorScreenState.puzzle_name,
    action: HintEditorScreenActions
): string {
    if (action.type === SET_HINT_EDITOR_PUZZLE_NAME) {
        return action.name;
    }

    return state;
}

export function hintEditorScreenReducer(
    state = defaultHintEditorScreenState,
    action: HintEditorScreenActions
): HintEditorScreenState {

    return {
        options_modal_open: toggleModalReducer(state.options_modal_open, action),
        export_modal_open: toggleExportModalReducer(state.export_modal_open, action),
        puzzle_name: puzzleNameReducer(state.puzzle_name, action),
        puzzle: puzzleReducer(state.puzzle, action)
    };
}