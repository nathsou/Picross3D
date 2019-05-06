import React, { Component, createRef, RefObject } from 'react';
import { connect } from 'react-redux';
import { PicrossPuzzle } from '../../../Puzzle/PicrossPuzzle';
import PHomeButton from '../components/PHomeButton';
import PModal from '../components/PModal';
import PSettingsButton from '../components/PSettingsButton';
import Puzzle from '../components/Puzzle';
import { disposePuzzleScreen, togglePuzzleOptionsModal } from '../store/screens/puzzle/actions';
import { PuzzleScreenState } from '../store/screens/puzzle/types';
import { PicrossState } from '../store/store';
import PButton from '../components/PButton';
import PBackButton from '../components/PBackButton';


interface PuzzleScreenProps extends PuzzleScreenState {
    dispose: () => void,
    toggleModal: () => void
}

class PuzzleScreen extends Component<PuzzleScreenProps> {

    private puzzle: RefObject<Puzzle>;

    constructor(props: PuzzleScreenProps) {
        super(props);
        this.puzzle = createRef<Puzzle>();
    }

    public componentWillUnmount() {
        this.props.dispose();
    }

    private closeModal = () => {
        if (this.props.options_modal_open) {
            this.props.toggleModal();
        }
    }

    public handleRestart = () => {
        this.puzzle.current.restart();
        this.closeModal();
    }

    public render() {
        const puzzle = PicrossPuzzle.fromJSON(this.props.puzzle);

        const { toggleModal, options_modal_open } = this.props;

        return (
            <div>
                <PSettingsButton onClick={toggleModal} />
                <PBackButton />
                <PModal show={options_modal_open} onClose={toggleModal}>
                    <PHomeButton />
                    <PButton onClick={this.handleRestart}>Restart</PButton>
                </PModal>
                <Puzzle puzzle={puzzle} ref={this.puzzle} />
            </div>
        );
    }
}

export default connect(
    (state: PicrossState) => state.puzzle_screen,
    {
        toggleModal: () => togglePuzzleOptionsModal(),
        dispose: () => disposePuzzleScreen()
    }
)(PuzzleScreen);