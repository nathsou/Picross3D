import { PicrossAction } from "../../../../PicrossController";
import { setActionKeyAction, SET_ACTION_KEY } from "./types";

export function setActionKey(action: PicrossAction, key: string): setActionKeyAction {
    return {
        type: SET_ACTION_KEY,
        payload: {
            action,
            key
        }
    };
}