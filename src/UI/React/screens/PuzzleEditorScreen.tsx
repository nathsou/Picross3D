import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PuzzleEditorController } from '../../../Editor/PuzzleEditorController';
import { PuzzleEditorRenderer } from '../../../Editor/PuzzleEditorRenderer';
import { CellState, PicrossShape } from '../../../PicrossShape';
import { PicrossPuzzle } from '../../../Puzzle/PicrossPuzzle';
import { PicrossSolver } from '../../../Solver/PicrossSolver';
import PButton from '../components/PButton';
import PButtonLink from '../components/PButtonLink';
import PModal from '../components/PModal';
import PSettingsButton from '../components/PSettingsButton';
import { toggleEditorOptionsModal, isGeneratingPuzzle } from '../store/screens/editor/actions';
import { EditorScreenState } from '../store/screens/editor/types';
import { setHintEditorPuzzle } from '../store/screens/hintEditor/actions';
import { PicrossState } from '../store/store';
import { PuzzleJSON } from '../../../Puzzle/Puzzles';
import PHomeButton from '../components/PHomeButton';

export interface PuzzleEditorScreenProps extends EditorScreenState {
    toggleModal: () => void,
    setHintEditorPuzzle: (puzzle: PuzzleJSON) => void,
    isGeneratingPuzzle: (generating: boolean) => void
}

class PuzzleEditorScreen extends Component<PuzzleEditorScreenProps> {

    private canvas: HTMLCanvasElement;
    private renderer: PuzzleEditorRenderer;
    private controller: PuzzleEditorController;
    private shape: PicrossShape;

    public componentDidMount() {
        const { shape } = this.props;
        this.renderer = new PuzzleEditorRenderer(this.canvas);
        this.shape = shape !== null ?
            PicrossShape.fromJSON(shape) :
            new PicrossShape(this.renderer.maxDims, CellState.blank);

        this.controller = new PuzzleEditorController(this.renderer, this.shape);
        this.controller.start();
    }

    public componentWillUnmount() {
        this.controller.dispose();
    }

    private closeModal = () => {
        if (this.props.options_modal_open) {
            this.props.toggleModal();
        }
    }

    private generateHintEditorPuzzle = async () => {

        this.props.isGeneratingPuzzle(true);

        return new Promise<boolean>((resolve) => {

            try {
                this.shape.trim();
                const puzzle = new PicrossPuzzle(this.shape);
                PicrossSolver.removeHints(puzzle);
                this.shape.fillBoundingBox();
                this.props.setHintEditorPuzzle(puzzle.toJSON());
                resolve(true);
            } catch (e) {
                console.error(e);
                resolve(false);
            }

        });
    }

    private reset = () => {
        this.controller.reset();
        this.closeModal();
    }

    private importPuzzle = () => {
        this.controller.selectFile();
        this.closeModal();
    }

    public render() {
        const { toggleModal, options_modal_open, generating_puzzle } = this.props;
        return (
            <div>
                <PSettingsButton onClick={toggleModal} />
                <PModal show={options_modal_open && !generating_puzzle} onClose={toggleModal}>
                    <PHomeButton onClick={this.closeModal} />
                    <PButtonLink to='hint_editor' waitFor={this.generateHintEditorPuzzle}>
                        Generate Puzzle
                    </PButtonLink>
                    <PButton onClick={this.reset}>Reset</PButton>
                    <PButton onClick={this.importPuzzle}>Import</PButton>
                </PModal>

                <PModal show={generating_puzzle} onClose={() => { }}>
                    <p>Removing hints...</p>
                </PModal>

                <canvas ref={cnv => this.canvas = cnv} tabIndex={1}></canvas>
            </div>
        );
    }
}

export default connect(
    (state: PicrossState) => state.editor_screen,
    {
        toggleModal: () => toggleEditorOptionsModal(),
        setHintEditorPuzzle: (puzzle: PuzzleJSON) => setHintEditorPuzzle(puzzle),
        isGeneratingPuzzle: (generating: boolean) => isGeneratingPuzzle(generating)
    }
)(PuzzleEditorScreen);