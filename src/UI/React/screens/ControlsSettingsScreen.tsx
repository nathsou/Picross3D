import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PicrossAction, PicrossControls } from '../../../PicrossController';
import PBackButton from '../components/PBackButton';
import PButton from '../components/PButton';
import { setActionKey } from '../store/controls/actions';
import { ControlsState } from '../store/controls/types';
import { ControlsSettingsScreenState } from '../store/screens/controls_settings/types';
import { PicrossState } from '../store/store';
import { setControlsSettingsListeningActionKey } from '../store/screens/controls_settings/actions';

interface ControlsSettingsScreenProps {
    controls: ControlsState,
    gui: ControlsSettingsScreenState,
    setActionKey: (action: PicrossAction, key: string) => void,
    setListeningActionKey: (action: PicrossAction) => void
}

class ControlsSettingsScreen extends Component<ControlsSettingsScreenProps> {

    private handleClick = (action: PicrossAction) => {
        this.props.setListeningActionKey(action);
        const keydown_handler = (ev: KeyboardEvent) => {
            this.props.setActionKey(action, ev.code);
            this.props.setListeningActionKey(null);
            window.removeEventListener('keydown', keydown_handler);
        };

        window.addEventListener('keydown', keydown_handler);
    };

    public componentWillUnmount() {
        this.props.setListeningActionKey(null);
    }

    public render() {
        const { hammer, brush, builder } = this.props.controls;
        const { listening_action_key } = this.props.gui;
        const controls: PicrossControls = { hammer, brush, builder };

        return (
            <div className='picross-container'>
                <h1>Controls</h1>
                <PBackButton />
                <div className='picross-vertical-container'>
                    {
                        Object.keys(controls).map(action =>
                            <PButton key={action} onClick={() => this.handleClick(action as PicrossAction)}>
                                {action !== listening_action_key ?
                                    `${action} -> ${controls[action as PicrossAction]}` :
                                    'Press any key..'
                                }
                            </PButton>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    (state: PicrossState) => ({
        controls: state.controls,
        gui: state.controls_settings_screen
    }),
    {
        setActionKey: (action: PicrossAction, key: string) => setActionKey(action, key),
        setListeningActionKey: (action: PicrossAction) => setControlsSettingsListeningActionKey(action)
    }
)(ControlsSettingsScreen);