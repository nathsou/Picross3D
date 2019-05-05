import React, { Component } from 'react';
import { collections } from "../../../PuzzleCollections/PuzzleCollections";
import { capitalize } from '../../../Utils/Utils';
import PButtonLink from '../components/PButtonLink';
import PBackButton from '../components/PBackButton';
import { connect } from 'react-redux';
import { setSelectedCollection } from '../store/collection_details/actions';

interface CollectionSelectionScreenProps {
    setSelectedCollection: (collection: string) => void
}

class CollectionSelectionScreen extends Component<CollectionSelectionScreenProps> {

    private selectCollection = (collection: string) => {
        this.props.setSelectedCollection(collection);
    }

    public render() {
        return (
            <div className='picross-container'>
                <PBackButton />
                <h1>Collections</h1>
                <div className='picross-vertical-container'>
                    {
                        Object.keys(collections).map(name =>
                            <PButtonLink to='collection_details' onClick={() => this.selectCollection(name)} key={name}>
                                {capitalize(name)}
                            </PButtonLink>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    null,
    { setSelectedCollection: (collection: string) => setSelectedCollection(collection) }
)(CollectionSelectionScreen);

