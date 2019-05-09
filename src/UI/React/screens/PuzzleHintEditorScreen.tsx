import { saveAs } from 'file-saver';
import React, { Component, createRef, RefObject } from 'react';
import { connect } from 'react-redux';
import { ShapeJSON } from '../../../PicrossShape';
import { PicrossPuzzle } from '../../../Puzzle/PicrossPuzzle';
import { PuzzleJSON } from '../../../Puzzle/Puzzles';
import { snakify, capitalize } from '../../../Utils/Utils';
import PBackButton from '../components/PBackButton';
import PButton from '../components/PButton';
import PButtonLink from '../components/PButtonLink';
import PHomeButton from '../components/PHomeButton';
import PModal from '../components/PModal';
import PSettingsButton from '../components/PSettingsButton';
import PuzzleHintEditor from '../components/PuzzleHintEditor';
import { setEditorShape } from '../store/screens/editor/actions';
import { setHintEditorPuzzle, toggleHintEditorOptionsModal, toggleHintEditorExportModal, setHintEditorPuzzleName } from '../store/screens/hintEditor/actions';
import { HintEditorScreenState } from '../store/screens/hintEditor/types';
import { setPuzzle } from '../store/screens/puzzle/actions';
import { PicrossState } from '../store/store';
import PuzzleExportModal from '../components/PuzzleExportModal';

interface PuzzleHintEditorScreenProps extends HintEditorScreenState {
    disposePuzzle: () => void,
    setTestPuzzle: (puzzle: PuzzleJSON) => void,
    setEditorShape: (shape: ShapeJSON) => void,
    toggleModal: () => void,
    toggleExportModal: () => void,
    setPuzzleName: (name: string) => void
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
        this.puzzle.name = capitalize(this.props.puzzle_name);

        const puzzle = new Blob(
            [JSON.stringify(this.puzzle.toJSON())], {
                type: 'application/json;charset=utf-8'
            });

        saveAs(puzzle, `${snakify(this.props.puzzle_name)}.json`);
        this.props.toggleExportModal();
    }

    private openExportModal = () => {
        this.closeModal();
        this.props.toggleExportModal();
    }

    private resetHints = () => {
        this.hintEditor.current.resetHints();
        this.closeModal();
    }

    public render() {
        const { toggleModal, toggleExportModal, options_modal_open, export_modal_open, setPuzzleName } = this.props;
        return (
            <div>
                <PSettingsButton onClick={toggleModal} />
                <PBackButton onClick={this.setEditorShape} />

                <PModal show={options_modal_open} onClose={toggleModal}>
                    <PHomeButton onClick={this.closeModal} />
                    <PButtonLink to='puzzle' onClick={this.testPuzzle}>Test Puzzle</PButtonLink>
                    <PButton onClick={this.resetHints}>Reset</PButton>
                    <PButton onClick={this.openExportModal}>Export</PButton>
                    <PButton>Add to collection</PButton>
                </PModal>

                <PuzzleExportModal
                    show={export_modal_open}
                    onClose={toggleExportModal}
                    onExport={this.exportPuzzle}
                    onTypeName={setPuzzleName}
                />

                <PuzzleHintEditor puzzle={this.puzzle} ref={this.hintEditor} />
            </div>
        );
    }
}

export default connect(
    (state: PicrossState) => state.hint_editor_screen,
    {
        toggleModal: () => toggleHintEditorOptionsModal(),
        toggleExportModal: () => toggleHintEditorExportModal(),
        disposePuzzle: () => setHintEditorPuzzle(null),
        setTestPuzzle: (puzzle: PuzzleJSON) => setPuzzle(puzzle),
        setEditorShape: (shape: ShapeJSON) => setEditorShape(shape),
        setPuzzleName: (name: string) => setHintEditorPuzzleName(name)
    }
)(PuzzleHintEditorScreen);