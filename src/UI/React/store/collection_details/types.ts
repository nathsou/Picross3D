
export interface CollectionDetailsScreenState {
    collection: string
};

export const SET_SELECTED_PUZZLE = 'SET_SELECTED_PUZZLE';

export interface setSelectedPuzzleAction {
    type: typeof SET_SELECTED_PUZZLE,
    collection: string
}

export type CollectionDetailsScreenActions = setSelectedPuzzleAction;