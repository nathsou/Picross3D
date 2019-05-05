import { CHANGE_SCREEN, GO_TO_PREVIOUS_SCREEN, ScreenActions, ScreenState } from "./types";

const defaultScreenState: ScreenState = {
    active_screen_key: 'home',
    history: []
};

export function screenReducer(
    state = defaultScreenState,
    action: ScreenActions
): ScreenState {

    switch (action.type) {

        case CHANGE_SCREEN:
            if (state.active_screen_key === action.active_screen_key) {
                return state;
            }

            if (action.active_screen_key === 'home') {
                return {
                    active_screen_key: 'home',
                    history: []
                };
            }

            return {
                active_screen_key: action.active_screen_key,
                history: [...state.history, state.active_screen_key]
            };

        case GO_TO_PREVIOUS_SCREEN:

            if (state.active_screen_key === 'home' || state.history.length === 0) {
                return state;
            }

            return {
                active_screen_key: state.history[state.history.length - 1],
                history: state.history.slice(0, state.history.length - 1)
            };

        default:
            return state;
    }
}