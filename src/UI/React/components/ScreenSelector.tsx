import React, { Component } from "react";
import { connect } from "react-redux";
import CollectionDetailsScreen from "../screens/CollectionDetailsScreen";
import CollectionSelectionScreen from "../screens/CollectionSelectionScreen";
import MainMenuScreen from "../screens/MainMenuScreen";
import PuzzleEditorScreen from "../screens/PuzzleEditorScreen";
import PuzzleHintEditorScreen from "../screens/PuzzleHintEditorScreen";
import PuzzleScreen from "../screens/PuzzleScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { ScreenState } from "../store/screens/screen/types";
import { PicrossState } from "../store/store";

class ScreenSelector extends Component<ScreenState> {

    public render() {
        switch (this.props.active_screen_key) {

            case 'home':
                return <MainMenuScreen />;

            case 'editor':
                return <PuzzleEditorScreen />;

            case 'hint_editor':
                return <PuzzleHintEditorScreen />;

            case 'puzzle':
                return <PuzzleScreen />

            case 'settings':
                return <SettingsScreen />

            case 'collections':
                return <CollectionSelectionScreen />;

            case 'collection_details':
                return <CollectionDetailsScreen />;

            default:
                return {};
        }
    }
}

export default connect(
    (state: PicrossState) => state.screen,
    null
)(ScreenSelector);