import React, { Component } from 'react';
import { PuzzleHintEditorController } from '../../../Editor/PuzzleHintEditorController';
import { PuzzleHintEditorRenderer } from '../../../Editor/PuzzleHintEditorRenderer';
import { PicrossPuzzle } from '../../../Puzzle/PicrossPuzzle';

interface PuzzleHintEditorProps {
    puzzle: PicrossPuzzle
}

export default class PuzzleHintEditor extends Component<PuzzleHintEditorProps> {

    private canvas: HTMLCanvasElement;
    private renderer: PuzzleHintEditorRenderer;
    private controller: PuzzleHintEditorController;

    public componentDidMount() {
        const { puzzle } = this.props;
        this.renderer = new PuzzleHintEditorRenderer(puzzle, this.canvas);
        this.controller = new PuzzleHintEditorController(puzzle, this.renderer);
        this.controller.start();
    }

    public componentWillUnmount() {
        this.controller.dispose();
    }

    public resetHints(): void {
        this.controller.resetHints();
    }

    public render() {
        return (
            <canvas ref={cnv => this.canvas = cnv} tabIndex={1}></canvas>
        );
    }
}