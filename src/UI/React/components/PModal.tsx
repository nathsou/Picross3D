import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PModalProps {
    open?: boolean,
    onClose: () => void,
    title?: string
}

export default class PModal extends Component<PModalProps> {

    public render() {
        return (
            <div className='picross-modal' style={{ display: this.props.open ? 'block' : 'none' }}>
                <div className='picross-modal-content'>
                    <div className="picross-modal-header">
                        <span className='picross-modal-close' onClick={this.props.onClose}>
                            <FontAwesomeIcon className='picross-modal-close-idle' icon={['far', 'dot-circle']} size='lg' />
                            <FontAwesomeIcon className='picross-modal-close-hover' icon={['far', 'circle']} size='lg' />
                        </span>
                        {this.props.title !== undefined ? this.props.title : 'Select an action'}
                    </div>

                    <div className='picross-modal-body'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}