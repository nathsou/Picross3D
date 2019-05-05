export type ScreenKey = 'home' | 'puzzle' | 'editor' |
    'collections' | 'collection_details' | 'hint_editor' | 'settings';

export interface ScreenState {
    active_screen_key: ScreenKey,
    history: ScreenKey[]
}

export const CHANGE_SCREEN = 'CHANGE_SCREEN';
export const GO_TO_PREVIOUS_SCREEN = 'GO_TO_PREVIOUS_SCREEN';

export interface changeScreenAction {
    type: typeof CHANGE_SCREEN,
    active_screen_key: ScreenKey
}

export interface goToPreviousScreenAction {
    type: typeof GO_TO_PREVIOUS_SCREEN
}

export type ScreenActions = changeScreenAction | goToPreviousScreenAction;