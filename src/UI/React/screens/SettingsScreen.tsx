import React, { Component } from 'react';
import PBackButton from '../components/PBackButton';
import PButtonLink from '../components/PButtonLink';

export default class SettingsScreen extends Component {

    public render() {
        return (
            <div className='picross-container'>
                <h1>Settings</h1>
                <PBackButton />
                <div className='picross-vertical-container'>
                    <PButtonLink to='controls'>Controls</PButtonLink>
                    {/* <PButtonLink to='theme'>Theme</PButtonLink> */}
                </div>
            </div>
        );
    }
}