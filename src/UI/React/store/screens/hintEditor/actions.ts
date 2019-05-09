import { TOGGLE_HINT_EDITOR_OPTIONS_MODAL, ToggleHintEditorOptionsModalAction, setHintEditorPuzzleAction, SET_HINT_EDITOR_PUZZLE, ToggleHintEditorExportModalAction, TOGGLE_HINT_EDITOR_EXPORT_MODAL, SET_HINT_EDITOR_PUZZLE_NAME, setHintEditorPuzzleNameAction } from "./types";
import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";

export function toggleHintEditorOptionsModal(): ToggleHintEditorOptionsModalAction {
    return {
        type: TOGGLE_HINT_EDITOR_OPTIONS_MODAL
    };
}

export function toggleHintEditorExportModal(): ToggleHintEditorExportModalAction {
    return {
        type: TOGGLE_HINT_EDITOR_EXPORT_MODAL
    };
}

export function setHintEditorPuzzle(puzzle: PuzzleJSON): setHintEditorPuzzleAction {
    return {
        type: SET_HINT_EDITOR_PUZZLE,
        puzzle
    };
}

export function setHintEditorPuzzleName(name: string): setHintEditorPuzzleNameAction {
    return {
        type: SET_HINT_EDITOR_PUZZLE_NAME,
        name
    };
}