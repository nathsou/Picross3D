import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeScreen } from '../store/screens/screen/actions';
import { ScreenKey } from '../store/screens/screen/types';
import PButton, { PButtonProps } from './PButton';

export interface PButtonLinkProps extends PButtonProps {
    to: ScreenKey,
    waitFor?: () => Promise<any>,
    changeScreen: (screen: ScreenKey) => void
}

class PButtonLink extends Component<PButtonLinkProps> {

    private redirect = async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (this.props.waitFor) {
            await this.props.waitFor();
        }

        if (this.props.onClick) {
            this.props.onClick(ev);
        }

        this.props.changeScreen(this.props.to);
    }

    public render() {
        return <PButton onClick={this.redirect}>{this.props.children}</PButton>;
    }
}

export default connect(
    null,
    { changeScreen: (screen: ScreenKey) => changeScreen(screen) }
)(PButtonLink)