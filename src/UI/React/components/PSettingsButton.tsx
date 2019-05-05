import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FunctionComponent } from 'react';
import { PButtonProps } from './PButton';

const PSettingsButton: FunctionComponent<PButtonProps> = ({ onClick }) => {
    return (
        <button className='picross-floating-btn picross-options-btn' onClick={onClick}>
            <FontAwesomeIcon icon='bars' size='2x' />
        </button>
    );
};

export default PSettingsButton;