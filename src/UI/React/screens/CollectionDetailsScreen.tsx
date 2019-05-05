import React, { Component } from 'react';
import { collections } from '../../../PuzzleCollections/PuzzleCollections';
import { capitalize } from '../../../Utils/Utils';
import PBackButton from '../components/PBackButton';
import PuzzleCard from '../components/PuzzleCard';
import { connect } from 'react-redux';
import { PicrossState } from '../store/store';
import { CollectionDetailsScreenState } from '../store/collection_details/types';

interface CollectionDetailsScreenProps extends CollectionDetailsScreenState { }

class CollectionDetailsScreen extends Component<CollectionDetailsScreenProps> {

    public render() {
        const { collection } = this.props;
        const puzzles = collections[collection];

        return (
            <div className='picross-container'>
                <h1>{capitalize(collection)}</h1>
                <PBackButton />
                <div className='picross-vertical-container'>
                    {
                        puzzles.map(puzzle => {
                            const { name } = puzzle;
                            return (
                                <PuzzleCard collection={collection} name={name.toLowerCase()} key={name}>
                                    {name}
                                </PuzzleCard>
                            )

                        })
                    }

                </div>
            </div>
        );
    }
}

export default connect(
    (state: PicrossState) => state.collection_details_screen
)(CollectionDetailsScreen);