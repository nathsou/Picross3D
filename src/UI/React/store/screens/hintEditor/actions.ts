import { TOGGLE_HINT_EDITOR_OPTIONS_MODAL, ToggleHintEditorOptionsModalAction, setHintEditorPuzzleAction, SET_HINT_EDITOR_PUZZLE } from "./types";
import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";

export function toggleHintEditorOptionsModal(): ToggleHintEditorOptionsModalAction {
    return {
        type: TOGGLE_HINT_EDITOR_OPTIONS_MODAL
    };
}

export function setHintEditorPuzzle(puzzle: PuzzleJSON): setHintEditorPuzzleAction {
    return {
        type: SET_HINT_EDITOR_PUZZLE,
        puzzle
    };
}