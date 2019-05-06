import { PicrossAction } from "../../../../../PicrossController";

export interface ControlsSettingsScreenState {
    listening_action_key: PicrossAction | null
}

export const SET_CONTROLS_SETTINGS_LISTENING_ACTION_KEY = 'SET_CONTROLS_SETTINGS_LISTENING_ACTION_KEY';

export interface setControlsSettingsListeningActionKeyAction {
    type: typeof SET_CONTROLS_SETTINGS_LISTENING_ACTION_KEY,
    listening_action_key: PicrossAction | null
}

export type ControlsSettingsScreenActions = setControlsSettingsListeningActionKeyAction;