import { Component } from "react";
import { connect } from "react-redux";
import { PicrossController } from "../../../PicrossController";
import { ControlsState } from "../store/controls/types";
import { PicrossState } from "../store/store";

class ControlsManager extends Component<ControlsState> {

    constructor(props: ControlsState) {
        super(props);
        this.updateControls();
    }

    private updateControls(): void {
        const { hammer, brush, builder } = this.props;
        PicrossController.setControls({ hammer, brush, builder });
    }

    public render(): null {
        this.updateControls();
        return null;
    }
}

export default connect(
    (state: PicrossState) => state.controls
)(ControlsManager);