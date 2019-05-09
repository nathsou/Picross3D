import React, { Component } from "react";
import PModal, { PModalProps } from "./PModal";
import PButton from "./PButton";
import { connect } from "react-redux";
import { PicrossState } from "../store/store";

interface PuzzleExportModalProps extends PModalProps {
    onExport: () => void,
    onTypeName: (name: string) => void,
    name: string
}

class PuzzleExportModal extends Component<PuzzleExportModalProps> {

    public render() {
        const { show, onClose, onExport, onTypeName, name } = this.props;

        return (
            <PModal title='Choose a name' show={show} onClose={onClose}>
                <input type='text' className='picross-text-input' value={name} onChange={e => onTypeName(e.target.value)}></input>
                <PButton onClick={onExport}>Export</PButton>
            </PModal>
        );
    };
}

export default connect(
    (state: PicrossState) => ({ name: state.hint_editor_screen.puzzle_name })
)(PuzzleExportModal);