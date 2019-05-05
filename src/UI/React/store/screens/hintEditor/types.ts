import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";

export interface HintEditorScreenState {
    options_modal_open: boolean,
    puzzle: PuzzleJSON
}

export const TOGGLE_HINT_EDITOR_OPTIONS_MODAL = 'TOGGLE_HINT_EDITOR_OPTIONS_MODAL';
export const SET_HINT_EDITOR_PUZZLE = 'SET_HINT_EDITOR_PUZZLE';

export interface ToggleHintEditorOptionsModalAction {
    type: typeof TOGGLE_HINT_EDITOR_OPTIONS_MODAL
}

export interface setHintEditorPuzzleAction {
    type: typeof SET_HINT_EDITOR_PUZZLE,
    puzzle: PuzzleJSON
}

export type HintEditorScreenActions = ToggleHintEditorOptionsModalAction | setHintEditorPuzzleAction;