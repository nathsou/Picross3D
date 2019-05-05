import { CollectionDetailsScreenState, CollectionDetailsScreenActions, SET_SELECTED_PUZZLE } from "./types";

const defaultCollectionDetailsScreenState: CollectionDetailsScreenState = {
    collection: null
};

export function collectionDetailsScreenReducer(
    state = defaultCollectionDetailsScreenState,
    action: CollectionDetailsScreenActions
): CollectionDetailsScreenState {

    switch (action.type) {
        case SET_SELECTED_PUZZLE:
            return { collection: action.collection };

        default:
            return state;
    }
}