import React from 'react';

import Board from '../Board/Board';
import Opening from '../Opening/Opening';

import classes from './Trainer.css';

import openings from '../../data/openings'

class Trainer extends React.Component {
    state = {
        openingsList: openings,
        relatedOpeningsList: [],

        openingECO: openings[0].openingECO,
        openingName: openings[0].openingName,
        openingFENs: openings[0].openingFENs,
        openingMoves: openings[0].openingMoves,
        selectedMoveIndex: 0,
    }

    search = e => {
        const value = e.target.value.toLowerCase();
        const openingsList = openings.filter(opening => {
            const name = opening.openingName.toLowerCase();
            return value.length === 0 || (value.length > 0 && name.includes(value));
        });
        this.setState({ openingsList });
    };

    moveIndexStartHandler = () => {
        this.setState({
            selectedMoveIndex: 0,
        })
    }

    moveIndexEndHandler = () => {
        this.setState({
            selectedMoveIndex: this.state.openingFENs.length - 1,
        })
    }

    moveIndexForwardHandler = () => {
        if (this.state.selectedMoveIndex < this.state.openingFENs.length - 1) {
            this.setState({
                selectedMoveIndex: this.state.selectedMoveIndex + 1,
            });
        };
    }

    moveIndexBackHandler = () => {
        if (this.state.selectedMoveIndex > 0) {
            this.setState({
                selectedMoveIndex: this.state.selectedMoveIndex - 1,
            });
        };
    }

    selectOpeningHandler = (openingIndex) => {
        this.setState({
            openingECO: this.state.openingsList[openingIndex].openingECO,
            openingName: this.state.openingsList[openingIndex].openingName,
            openingFENs: this.state.openingsList[openingIndex].openingFENs,
            openingMoves: this.state.openingsList[openingIndex].openingMoves,
            selectedMoveIndex: 0,
        })
    }

    render() {
        const searchResults = this.state.openingsList.map(
            (x, i) => <Opening selectionHandler={() => this.selectOpeningHandler(i)} openingECO={x.openingECO} openingName={x.openingName} selected={this.state.openingName === x.openingName} />
        );

        const searchResultsDisplay = searchResults.length > 0 ? searchResults : (
            <div className={classes.NoResults}>No openings found...</div>
        );

        return (
            <div className={classes.Layout}>

                
                <div className={classes.Side}>
                    {/* HEAD PANEL */}
                    <div className={classes.headPanel}>
                        <i class="fa fa-crow" />
                        <span className={classes.headMain}>CROW</span> <span className={classes.headSub}>ECO DATABASE BROWSER</span>
                    </div>

                    {/* NAVIGATOR */}
                    <div className={classes.SidePanel}>
                        <div className={classes.SubTitle}>OPENING VIEWER</div>
                        <div className={classes.Title}>
                            <span className={classes.TitleECO}>{this.state.openingECO} </span>
                            {this.state.openingName}
                        </div>
                        <div className={classes.PGN}>
                            {this.state.openingMoves}
                        </div>
                        <br />
                        <div className={classes.Navigator}>
                            <table>
                                <td className={classes.Filler} />
                                <td><button onClick={this.moveIndexStartHandler} disabled={this.state.selectedMoveIndex <= 0}><i class="fa fa-fast-backward" /></button></td>
                                <td><button onClick={this.moveIndexBackHandler} disabled={this.state.selectedMoveIndex <= 0}><i class="fa fa-step-backward" /></button></td>
                                <td className={classes.MoveIndex}>{this.state.selectedMoveIndex + 1} / {this.state.openingFENs.length}</td>
                                <td><button onClick={this.moveIndexForwardHandler} disabled={this.state.selectedMoveIndex >= this.state.openingFENs.length - 1}><i class="fa fa-step-forward" /></button></td>
                                <td><button onClick={this.moveIndexEndHandler} disabled={this.state.selectedMoveIndex >= this.state.openingFENs.length - 1}><i class="fa fa-fast-forward" /></button></td>
                                <td className={classes.Filler} />
                            </table>
                        </div>
                    </div>

                    {/* BROWSER */}
                    <div className={classes.SidePanel}>
                        <div className={classes.SubTitle}>OPENING BROWSER ({searchResults.length}/{openings.length})</div>
                        <div className={classes.SearchField}>
                            <input type="text" placeholder="Search Openings..." onChange={this.search} />
                        </div>
                        <div className={classes.Browser}>
                            <table>
                                {searchResultsDisplay}
                            </table>
                        </div>
                    </div>
                </div>

                {/* SIDE BOARD */}
                <Board openingFEN={this.state.openingFENs[this.state.selectedMoveIndex]} />
                <main>
                    {this.props.children}
                </main>
            </div> 
        );
    };
};

export default Trainer;