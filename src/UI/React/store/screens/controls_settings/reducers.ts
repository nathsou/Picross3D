import { ControlsSettingsScreenState, ControlsSettingsScreenActions, SET_CONTROLS_SETTINGS_LISTENING_ACTION_KEY } from "./types";

const defaultControlsSettingsScreenState: ControlsSettingsScreenState = {
    listening_action_key: null
};

export function controlsSettingsScreenReducer(
    state = defaultControlsSettingsScreenState,
    action: ControlsSettingsScreenActions
): ControlsSettingsScreenState {

    switch (action.type) {
        case SET_CONTROLS_SETTINGS_LISTENING_ACTION_KEY:
            return { listening_action_key: action.listening_action_key };
        default:
            return state;
    }
}