import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect } from "react-redux";
import { goToPreviousScreen } from "../store/screens/screen/actions";
import { PButtonLinkProps } from "./PButtonLink";

interface PBackButtonProps extends Pick<PButtonLinkProps, 'waitFor'> {
    icon?: IconProp,
    size?: SizeProp,
    onClick?: () => void,
    goBack: () => void
}

class PBackButton extends Component<PBackButtonProps> {

    private goBack = async () => {

        if (this.props.waitFor) {
            await this.props.waitFor();
        }

        if (this.props.onClick) {
            this.props.onClick();
        }

        this.props.goBack();
    }

    public render() {

        ///@ts-ignore
        const icon = this.props.icon ? this.props.icon : 'chevron-left';
        const size = this.props.size ? this.props.size : '2x';

        return (<div className='picross-floating-btn picross-back-btn' onClick={this.goBack}>
            <FontAwesomeIcon icon={icon} size={size} />
        </div>);
    }

}
export default connect(
    null,
    { goBack: () => goToPreviousScreen() }
)(PBackButton);