import React from 'react';

import Board from '../Board/Board';
import Opening from '../Opening/Opening';

import classes from './Layout.css';

import openings from '../../data/openings'

const ECOCategories = {
    'A': 'Flank Openings',
    'B': 'Semi-Open Games',
    'C': 'Open Games',
    'D': 'Closed and Semi-Closed Games',
    'E': 'Indian Defences',
}

class Layout extends React.Component {
    state = {
        openingsList: openings,
        relatedOpeningsList: [],
        browsingHistory: [0],

        openingIndex: 0,
        moveIndex: 0,
    };

    search = e => {
        const searchValue = e.target.value.toLowerCase();
        const openingsList = openings.filter(opening => {
            const name = opening.openingName.toLowerCase();
            const ECO = opening.openingECO.toLowerCase();
            return searchValue.length === 0 || (searchValue.length > 0 && (name.includes(searchValue) || (ECO === searchValue)));
        });
        this.setState({openingsList});
    };

    searchRelated = (op) => {
        const searchMoves = op.openingMoves;
        const searchName = op.openingName;
        const relatedOpeningsList = openings.filter(opening => {
            const name = opening.openingName;
            const moves = opening.openingMoves.substring(0, searchMoves.length);
            return moves === searchMoves && name !== searchName
        });
        this.setState({relatedOpeningsList});
    }

    moveIndexStartHandler = () => {
        this.setState({
            moveIndex: 0,
        })
    };

    moveIndexEndHandler = () => {
        this.setState({
            moveIndex: openings[this.state.openingIndex].openingFENs.length - 1,
        })
    };

    moveIndexForwardHandler = () => {
        if (this.state.moveIndex < openings[this.state.openingIndex].openingFENs.length - 1) {
            this.setState({
                moveIndex: this.state.moveIndex + 1,
            });
        };
    };

    moveIndexBackHandler = () => {
        if (this.state.moveIndex > 0) {
            this.setState({
                moveIndex: this.state.moveIndex - 1,
            });
        };
    };

    selectLastOpening = () => {
        let op = openings[this.state.browsingHistory[this.state.browsingHistory.length - 2]];
        this.setState({
            openingIndex: op.openingIndex,
            moveIndex: openings[op.openingIndex].openingFENs.length - 1,
            browsingIndex: this.state.browsingHistory.splice(-1, 1),
        });
    }

    selectOpening = (index, list=openings) => {
        let op = list[index];
        this.setState({ 
            openingIndex: op.openingIndex,
            moveIndex: openings[op.openingIndex].openingFENs.length - 1,
        });
        this.searchRelated(openings[op.openingIndex])

        // handle browsing history
        this.state.browsingHistory.push(op.openingIndex);
    }

    render() {
        const searchResults = this.state.openingsList.map(
            (x, i) => <Opening selectionHandler={() => this.selectOpening(i, this.state.openingsList)} openingECO={x.openingECO} openingName={x.openingName} selected={this.state.openingIndex === x.openingIndex} />
        );

        const searchResultsDisplay = searchResults.length > 0 ? searchResults : (
            <div className={classes.NoResults}>No openings found...</div>
        );

        // TODO
        const relatedOpeningsResults = this.state.relatedOpeningsList.map(
            (x, i) => <Opening selectionHandler={() => this.selectOpening(i, this.state.relatedOpeningsList)} openingECO={x.openingECO} openingName={x.openingName} selected={this.state.openingIndex === x.openingIndex} />
        );

        const relatedOpeningsResultsDisplay = relatedOpeningsResults.length > 0 ? relatedOpeningsResults : (
            <div className={classes.NoResults}>No child openings found...</div>
        );
        // END TODO

        const opening = {
            ECO: openings[this.state.openingIndex].openingECO,
            name: openings[this.state.openingIndex].openingName,
            FENs: openings[this.state.openingIndex].openingFENs,
            moves: openings[this.state.openingIndex].openingMoves,
            whiteScore: openings[this.state.openingIndex].openingWhiteScore,
            drawScore: openings[this.state.openingIndex].openingDrawScore,
            blackScore: openings[this.state.openingIndex].openingBlackScore,
        };

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
                        <div className={classes.SubTitle}>
                            OPENING VIEWER
                        </div>
                        <div className={classes.Title}>
                            <span className={classes.TitleECO}>{opening.ECO} </span>
                            {opening.name}
                        </div>
                        <div className={classes.PGN}>
                            {opening.moves}
                        </div>
                        <br />
                        <div className={classes.Navigator}>
                            <table>
                                <td className={classes.Filler}><button onClick={this.selectLastOpening} disabled={this.state.browsingHistory.length <= 1}><i class="fa fa-arrow-left" /></button></td>
                                <td><button onClick={this.moveIndexStartHandler} disabled={this.state.moveIndex <= 0}><i class="fa fa-fast-backward" /></button></td>
                                <td><button onClick={this.moveIndexBackHandler} disabled={this.state.moveIndex <= 0}><i class="fa fa-step-backward" /></button></td>
                                <td className={classes.MoveIndex}>{this.state.moveIndex + 1} / {opening.FENs.length}</td>
                                <td><button onClick={this.moveIndexForwardHandler} disabled={this.state.moveIndex >= opening.FENs.length - 1}><i class="fa fa-step-forward" /></button></td>
                                <td><button onClick={this.moveIndexEndHandler} disabled={this.state.moveIndex >= opening.FENs.length - 1}><i class="fa fa-fast-forward" /></button></td>
                                <td className={classes.Filler} />
                            </table>
                        </div>
                    </div>

                    {/* BROWSER */}
                    <div className={classes.SidePanel}>
                        <div className={classes.SubTitle}>OPENING BROWSER ({searchResults.length}/{openings.length})</div>
                        <div className={classes.SearchField}>
                            <input type="text" placeholder="Search openings..." onChange={this.search} />
                        </div>
                        <div className={classes.Browser}>
                            <table>
                                {searchResultsDisplay}
                            </table>
                        </div>
                    </div>
                </div>

                <div>
                    {/* SIDE BOARD */}
                    <Board openingFEN={opening.FENs[this.state.moveIndex]} />

                    {/* DETAILS PANEL */}
                    <div className={classes.DetailsPanel}>
                        <div className={classes.SubTitle}>DETAILS</div>
                        <div className={classes.Details}>
                            <div><b>Name/s:</b> {opening.name}</div>
                            <div><b>ECO Category:</b> [{opening.ECO}] {ECOCategories[opening.ECO.substring(0, 1)]}</div>
                            <div><b>Avg. Scores:</b></div>
                            <div className={classes.Statistics}>
                                <div className={classes.StatisticsWhite} style={{ flex: `1 1 ${opening.whiteScore}%` }}>{opening.whiteScore}</div>
                                <div className={classes.StatisticsDraw} style={{ flex: `1 1 ${opening.drawScore}%` }}>{opening.drawScore}</div>
                                <div className={classes.StatisticsBlack} style={{ flex: `1 1 ${opening.blackScore}%` }}>{opening.blackScore}</div>
                            </div>
                        </div>


                        <div>Child Openings ({relatedOpeningsResults.length})</div>
                        <div className={classes.Browser}>
                            <table>
                                {relatedOpeningsResultsDisplay}
                            </table>
                        </div>
                    </div>
                </div>

                <main>
                    {this.props.children}
                </main>
            </div> 
        );
    };
};

export default Layout;