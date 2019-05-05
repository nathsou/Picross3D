import React, { Component } from 'react';
import { PicrossPuzzle } from '../../../Puzzle/PicrossPuzzle';
import { PuzzleRenderer } from '../../../Puzzle/PuzzleRenderer';
import { PuzzleController } from '../../../Puzzle/PuzzleController';

interface PuzzleProps {
    puzzle: PicrossPuzzle
}

export default class Puzzle extends Component<PuzzleProps> {

    private canvas: HTMLCanvasElement;
    private renderer: PuzzleRenderer;
    private controller: PuzzleController;

    public componentDidMount() {
        const { puzzle } = this.props;
        this.renderer = new PuzzleRenderer(puzzle, this.canvas);
        this.controller = new PuzzleController(puzzle, this.renderer);
        this.controller.start();
    }

    public componentWillUnmount() {
        this.controller.dispose();
    }

    public restart() {
        this.controller.restart();
    }

    public render() {
        return (
            <canvas ref={cnv => this.canvas = cnv} tabIndex={1}></canvas>
        );
    }
}