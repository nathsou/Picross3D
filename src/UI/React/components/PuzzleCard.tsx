import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PuzzleJSON } from '../../../Puzzle/Puzzles';
import { collections } from '../../../PuzzleCollections/PuzzleCollections';
import PButtonLink from './PButtonLink';
import { setPuzzle } from '../store/screens/puzzle/actions';

interface PuzzleCardProps {
    collection: string,
    name: string,
    setPuzzle: (puzzle: PuzzleJSON) => void
}

class PuzzleCard extends Component<PuzzleCardProps> {

    // TODO: Handle unknown puzzles
    private findPuzzle(collection: string, name: string): PuzzleJSON {
        return collections[Object.keys(collections)
            .find(col => collection === col.toLowerCase())
        ].find(puzzle => puzzle.name.toLowerCase() === name);
    }

    private onClick = () => {
        const { collection, name } = this.props;
        const puzzle = this.findPuzzle(collection, name);
        this.props.setPuzzle(puzzle);
    }

    public render() {
        return (
            <PButtonLink to={'puzzle'} onClick={this.onClick}>
                {this.props.children}
            </PButtonLink>
        );
    }
}

export default connect(
    null,
    { setPuzzle: (puzzle: PuzzleJSON) => setPuzzle(puzzle) }
)(PuzzleCard);