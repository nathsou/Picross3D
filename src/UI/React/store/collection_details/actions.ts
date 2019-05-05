import { setSelectedPuzzleAction, SET_SELECTED_PUZZLE } from "./types";

export function setSelectedCollection(collection: string): setSelectedPuzzleAction {
    return {
        type: SET_SELECTED_PUZZLE,
        collection
    };
}