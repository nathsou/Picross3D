import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";

export interface HintEditorScreenState {
    options_modal_open: boolean,
    export_modal_open: boolean,
    puzzle_name: string,
    puzzle: PuzzleJSON
}

export const TOGGLE_HINT_EDITOR_OPTIONS_MODAL = 'TOGGLE_HINT_EDITOR_OPTIONS_MODAL';
export const TOGGLE_HINT_EDITOR_EXPORT_MODAL = 'TOGGLE_HINT_EDITOR_EXPORT_MODAL';
export const SET_HINT_EDITOR_PUZZLE = 'SET_HINT_EDITOR_PUZZLE';
export const SET_HINT_EDITOR_PUZZLE_NAME = 'SET_HINT_EDITOR_PUZZLE_NAME';

export interface ToggleHintEditorOptionsModalAction {
    type: typeof TOGGLE_HINT_EDITOR_OPTIONS_MODAL
}

export interface ToggleHintEditorExportModalAction {
    type: typeof TOGGLE_HINT_EDITOR_EXPORT_MODAL
}

export interface setHintEditorPuzzleAction {
    type: typeof SET_HINT_EDITOR_PUZZLE,
    puzzle: PuzzleJSON
}

export interface setHintEditorPuzzleNameAction {
    type: typeof SET_HINT_EDITOR_PUZZLE_NAME,
    name: string
}

export type HintEditorScreenActions =
    ToggleHintEditorOptionsModalAction |
    setHintEditorPuzzleAction |
    ToggleHintEditorExportModalAction |
    setHintEditorPuzzleNameAction;