import { saveAs } from 'file-saver';
import React, { Component, createRef, RefObject } from 'react';
import { connect } from 'react-redux';
import { ShapeJSON } from '../../../PicrossShape';
import { PicrossPuzzle } from '../../../Puzzle/PicrossPuzzle';
import { PuzzleJSON } from '../../../Puzzle/Puzzles';
import { snakify } from '../../../Utils/Utils';
import PBackButton from '../components/PBackButton';
import PButton from '../components/PButton';
import PButtonLink from '../components/PButtonLink';
import PHomeButton from '../components/PHomeButton';
import PModal from '../components/PModal';
import PSettingsButton from '../components/PSettingsButton';
import PuzzleHintEditor from '../components/PuzzleHintEditor';
import { setEditorShape } from '../store/screens/editor/actions';
import { setHintEditorPuzzle, toggleHintEditorOptionsModal } from '../store/screens/hintEditor/actions';
import { HintEditorScreenState } from '../store/screens/hintEditor/types';
import { setPuzzle } from '../store/screens/puzzle/actions';
import { PicrossState } from '../store/store';

interface PuzzleHintEditorScreenProps extends HintEditorScreenState {
    disposePuzzle: () => void,
    setTestPuzzle: (puzzle: PuzzleJSON) => void,
    setEditorShape: (shape: ShapeJSON) => void,
    toggleModal: () => void,
}

class PuzzleHintEditorScreen extends Component<PuzzleHintEditorScreenProps> {

    private puzzle: PicrossPuzzle;
    private hintEditor: RefObject<PuzzleHintEditor>;
    private testing = false;

    constructor(props: PuzzleHintEditorScreenProps) {
        super(props);
        this.puzzle = PicrossPuzzle.fromJSON(props.puzzle);
        this.hintEditor = createRef<PuzzleHintEditor>();
    }

    private closeModal = () => {
        if (this.props.options_modal_open) {
            this.props.toggleModal();
        }
    }

    public componentWillUnmount() {
        if (!this.testing) {
            this.props.disposePuzzle();
        }
    }

    public setEditorShape = () => {
        this.props.setEditorShape(this.puzzle.shape.toJSON());
    }

    private testPuzzle = () => {
        this.testing = true;
        this.closeModal();
        this.props.setTestPuzzle(this.puzzle.toJSON());
    }

    private exportPuzzle = () => {
        const puzzle = new Blob(
            [JSON.stringify(this.puzzle.toJSON())], {
                type: 'application/json;charset=utf-8'
            });

        saveAs(puzzle, `${snakify(this.puzzle.name)}.json`);
    }

    private resetHints = () => {
        this.hintEditor.current.resetHints();
    }

    public render() {
        const { toggleModal, options_modal_open } = this.props;
        return (
            <div>
                <PSettingsButton onClick={toggleModal} />
                <PBackButton onClick={this.setEditorShape} />

                <PModal open={options_modal_open} onClose={toggleModal}>
                    <PHomeButton onClick={this.closeModal} />
                    <PButtonLink to='puzzle' onClick={this.testPuzzle}>Test Puzzle</PButtonLink>
                    <PButton onClick={this.resetHints}>Reset</PButton>
                    <PButton onClick={this.exportPuzzle}>Export</PButton>
                    <PButton>Add to collection</PButton>
                </PModal>

                <PuzzleHintEditor puzzle={this.puzzle} ref={this.hintEditor} />
            </div>
        );
    }
}

export default connect(
    (state: PicrossState) => state.hint_editor_screen,
    {
        toggleModal: () => toggleHintEditorOptionsModal(),
        disposePuzzle: () => setHintEditorPuzzle(null),
        setTestPuzzle: (puzzle: PuzzleJSON) => setPuzzle(puzzle),
        setEditorShape: (shape: ShapeJSON) => setEditorShape(shape)
    }
)(PuzzleHintEditorScreen);