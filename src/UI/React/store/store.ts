import { combineReducers, createStore, Store } from "redux";
import { EditorScreenState } from "./screens/editor/types";
import { editorScreenReducer } from "./screens/editor/reducers";
import { HintEditorScreenState } from "./screens/hintEditor/types";
import { hintEditorScreenReducer } from "./screens/hintEditor/reducers";
import { PuzzleScreenState } from "./screens/puzzle/types";
import { puzzleScreenReducer } from "./screens/puzzle/reducers";
import { ScreenState } from "./screens/screen/types";
import { screenReducer } from "./screens/screen/reducers";
import { CollectionDetailsScreenState } from "./collection_details/types";
import { collectionDetailsScreenReducer } from "./collection_details/reducers";


export interface PicrossState {
    puzzle_screen: PuzzleScreenState,
    editor_screen: EditorScreenState,
    collection_details_screen: CollectionDetailsScreenState,
    hint_editor_screen: HintEditorScreenState,
    screen: ScreenState
}

const rootReducer = combineReducers<PicrossState>({
    puzzle_screen: puzzleScreenReducer,
    editor_screen: editorScreenReducer,
    collection_details_screen: collectionDetailsScreenReducer,
    hint_editor_screen: hintEditorScreenReducer,
    screen: screenReducer
});

export function configureStore(): Store<PicrossState> {
    return createStore(
        rootReducer,
        {},
        //@ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
}