import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PicrossPuzzle } from '../../../Puzzle/PicrossPuzzle';
import { PuzzleController } from '../../../Puzzle/PuzzleController';
import { PuzzleRenderer } from '../../../Puzzle/PuzzleRenderer';
import PBackButton from '../components/PBackButton';
import PButton from '../components/PButton';
import PHomeButton from '../components/PHomeButton';
import PModal from '../components/PModal';
import PSettingsButton from '../components/PSettingsButton';
import { disposePuzzleScreen, setPuzzleEndTime, setPuzzleStartTime, togglePuzzleOptionsModal } from '../store/screens/puzzle/actions';
import { PuzzleScreenState } from '../store/screens/puzzle/types';
import { PicrossState } from '../store/store';


interface PuzzleScreenProps extends PuzzleScreenState {
    dispose: () => void,
    toggleModal: () => void,
    setStartTime: () => void,
    setEndTime: () => void
}

class PuzzleScreen extends Component<PuzzleScreenProps> {

    private canvas: HTMLCanvasElement;
    private renderer: PuzzleRenderer;
    private controller: PuzzleController;
    private puzzle: PicrossPuzzle;

    public componentDidMount() {
        this.puzzle = PicrossPuzzle.fromJSON(this.props.puzzle);
        this.renderer = new PuzzleRenderer(this.puzzle, this.canvas);
        this.controller = new PuzzleController(this.puzzle, this.renderer);
        this.controller.start();
        this.props.setStartTime();
        this.puzzle.onResolved(this.onSolved);
    }

    public componentWillUnmount() {
        this.controller.dispose();
        this.props.dispose();
    }

    private onSolved = () => {
        this.props.setEndTime();
    }

    public restart() {
        this.controller.restart();
    }

    private closeModal = () => {
        if (this.props.options_modal_open) {
            this.props.toggleModal();
        }
    }

    public handleRestart = () => {
        this.restart();
        this.closeModal();
    }

    public render() {

        const { toggleModal, options_modal_open, end_time } = this.props;

        return (
            <div>
                <PSettingsButton onClick={toggleModal} />
                <PBackButton />
                <PModal show={options_modal_open} onClose={toggleModal}>
                    <PHomeButton />
                    <PButton onClick={this.handleRestart}>Restart</PButton>
                </PModal>

                <canvas ref={cnv => this.canvas = cnv} tabIndex={1}></canvas>
            </div>
        );
    }
}

export default connect(
    (state: PicrossState) => state.puzzle_screen,
    {
        toggleModal: () => togglePuzzleOptionsModal(),
        dispose: () => disposePuzzleScreen(),
        setStartTime: setPuzzleStartTime,
        setEndTime: setPuzzleEndTime
    }
)(PuzzleScreen);