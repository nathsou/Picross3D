import React, { Component } from 'react';
import PButtonLink from '../components/PButtonLink';

export default class MainMenuScreen extends Component {

    public render() {
        return (
            <div className='picross-container'>
                <h1>Picross</h1>
                <div className='picross-vertical-container'>
                    <PButtonLink to='collections'>Play</PButtonLink>
                    <PButtonLink to='editor'>Editor</PButtonLink>
                    <PButtonLink to='settings'>Settings</PButtonLink>
                </div>
            </div>
        );
    }
}