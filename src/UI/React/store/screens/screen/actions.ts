import { ScreenKey, changeScreenAction, CHANGE_SCREEN, goToPreviousScreenAction, GO_TO_PREVIOUS_SCREEN } from "./types";

export function changeScreen(active_screen_key: ScreenKey): changeScreenAction {
    return {
        type: CHANGE_SCREEN,
        active_screen_key
    };
}

export function goToPreviousScreen(): goToPreviousScreenAction {
    return {
        type: GO_TO_PREVIOUS_SCREEN
    };
}