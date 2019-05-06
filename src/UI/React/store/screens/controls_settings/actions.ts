import { PicrossAction } from "../../../../../PicrossController";
import { setControlsSettingsListeningActionKeyAction, SET_CONTROLS_SETTINGS_LISTENING_ACTION_KEY } from "./types";

export function setControlsSettingsListeningActionKey(
    action: PicrossAction
): setControlsSettingsListeningActionKeyAction {
    return {
        type: SET_CONTROLS_SETTINGS_LISTENING_ACTION_KEY,
        listening_action_key: action
    };
}