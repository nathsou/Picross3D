import React, { FunctionComponent } from 'react';

export type PButtonProps = Pick<React.DOMAttributes<HTMLButtonElement>, 'onClick'>;

const PButton: FunctionComponent<PButtonProps> = ({ onClick, children }) =>
    <button className='picross-btn' onClick={onClick}>{children}</button>;

export default PButton;