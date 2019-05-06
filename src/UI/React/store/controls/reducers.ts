import { ControlsState, ControlsActions, SET_ACTION_KEY } from "./types";

const defaultControlsState: ControlsState = {
    hammer: 'KeyW',
    brush: 'KeyA',
    builder: 'KeyQ'
};

export function controlsReducer(
    state = defaultControlsState,
    action: ControlsActions
): ControlsState {

    switch (action.type) {
        case SET_ACTION_KEY:
            const ctrls = { ...state };
            ctrls[action.payload.action] = action.payload.key;

            return ctrls;
        default:
            return state;
    }
}