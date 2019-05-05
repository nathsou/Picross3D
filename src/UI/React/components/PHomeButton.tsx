import React, { FunctionComponent } from "react";
import PButtonLink from "./PButtonLink";
import { PButtonProps } from "./PButton";

const PHomeButton: FunctionComponent<PButtonProps> = ({ onClick }) =>
    <PButtonLink to='home' onClick={onClick}>Home Menu</PButtonLink>;

export default PHomeButton;