import { PuzzleJSON } from "../../../../../Puzzle/Puzzles";

export interface PuzzleScreenState {
    options_modal_open: boolean,
    puzzle: PuzzleJSON
}

export const TOGGLE_PUZZLE_OPTIONS_MODAL = 'TOGGLE_PUZZLE_OPTIONS_MODAL';
export const SET_PUZZLE = 'SET_PUZZLE';
export const DISPOSE_PUZZLE_SCREEN = 'DISPOSE_PUZZLE_SCREEN';

export interface TogglePuzzleOptionsModalAction {
    type: typeof TOGGLE_PUZZLE_OPTIONS_MODAL
}

export interface setPuzzleAction {
    type: typeof SET_PUZZLE,
    puzzle: PuzzleJSON
}

export interface disposePuzzleScreenAction {
    type: typeof DISPOSE_PUZZLE_SCREEN
}

export type PuzzleScreenActions = TogglePuzzleOptionsModalAction | setPuzzleAction | disposePuzzleScreenAction;