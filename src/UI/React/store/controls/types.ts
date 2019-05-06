import { PicrossControls, PicrossAction } from "../../../../PicrossController";

export interface ControlsState extends PicrossControls {

}

export const SET_ACTION_KEY = 'SET_ACTION_KEY';

export interface setActionKeyAction {
    type: typeof SET_ACTION_KEY,
    payload: {
        action: PicrossAction,
        key: string
    }
}

export type ControlsActions = setActionKeyAction;