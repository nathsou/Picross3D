import React, { Component } from 'react';
import PButton from '../components/PButton';
import PBackButton from '../components/PBackButton';

export default class SettingsScreen extends Component {

    public render() {
        return (
            <div className='picross-container'>
                <h1>Settings</h1>
                <PBackButton />
                <div className='picross-vertical-container'>
                    <PButton>Controls</PButton>
                </div>
            </div>
        );
    }
}