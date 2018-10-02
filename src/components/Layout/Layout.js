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
        browsingHistory: ['Anderssen\'s Opening'],

        openingECO: openings[0].openingECO,
        openingName: openings[0].openingName,
        openingFENs: openings[0].openingFENs,
        openingMoves: openings[0].openingMoves,
        openingWhiteScore: openings[0].openingWhiteScore,
        openingDrawScore: openings[0].openingDrawScore,
        openingBlackScore: openings[0].openingBlackScore,
        selectedMoveIndex: openings[0].openingFENs.length - 1,
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

    searchRelated = (m, n) => {
        const searchMoves = m;
        const searchName = n;
        const relatedOpeningsList = openings.filter(opening => {
            const name = opening.openingName;
            const moves = opening.openingMoves.substring(0, searchMoves.length);
            return moves === searchMoves && name !== searchName;
        });
        this.setState({relatedOpeningsList});
    }

    selectFromNameHandler = (searchName) => {
        const resultList = openings.filter(opening => {
            return opening.openingName === searchName;
        });
        if (resultList.length !== 0) {
            this.setState({
                openingECO: resultList[0].openingECO,
                openingName: resultList[0].openingName,
                openingFENs: resultList[0].openingFENs,
                openingMoves: resultList[0].openingMoves,
                openingWhiteScore: resultList[0].openingWhiteScore,
                openingDrawScore: resultList[0].openingDrawScore,
                openingBlackScore: resultList[0].openingBlackScore,
                selectedMoveIndex: resultList[0].openingFENs.length - 1,
            });
            this.searchRelated(resultList[0].openingMoves, resultList[0].openingName);
            this.state.browsingHistory.splice(-1, 1);
        }
    }

    moveIndexStartHandler = () => {
        this.setState({
            selectedMoveIndex: 0,
        })
    };

    moveIndexEndHandler = () => {
        this.setState({
            selectedMoveIndex: this.state.openingFENs.length - 1,
        })
    };

    moveIndexForwardHandler = () => {
        if (this.state.selectedMoveIndex < this.state.openingFENs.length - 1) {
            this.setState({
                selectedMoveIndex: this.state.selectedMoveIndex + 1,
            });
        };
    };

    moveIndexBackHandler = () => {
        if (this.state.selectedMoveIndex > 0) {
            this.setState({
                selectedMoveIndex: this.state.selectedMoveIndex - 1,
            });
        };
    };

    selectOpeningHandler = (openingIndex) => {
        this.setState({
            openingECO: this.state.openingsList[openingIndex].openingECO,
            openingName: this.state.openingsList[openingIndex].openingName,
            openingFENs: this.state.openingsList[openingIndex].openingFENs,
            openingMoves: this.state.openingsList[openingIndex].openingMoves,
            openingWhiteScore: this.state.openingsList[openingIndex].openingWhiteScore,
            openingDrawScore: this.state.openingsList[openingIndex].openingDrawScore,
            openingBlackScore: this.state.openingsList[openingIndex].openingBlackScore,
            
            selectedMoveIndex: this.state.openingsList[openingIndex].openingFENs.length - 1,
        });
        this.searchRelated(this.state.openingsList[openingIndex].openingMoves, this.state.openingsList[openingIndex].openingName);
        this.state.browsingHistory.push(this.state.openingsList[openingIndex].openingName);
    };

    selectRelatedOpeningHandler = (openingIndex) => {
        this.setState({
            openingECO: this.state.relatedOpeningsList[openingIndex].openingECO,
            openingName: this.state.relatedOpeningsList[openingIndex].openingName,
            openingFENs: this.state.relatedOpeningsList[openingIndex].openingFENs,
            openingMoves: this.state.relatedOpeningsList[openingIndex].openingMoves,
            openingWhiteScore: this.state.relatedOpeningsList[openingIndex].openingWhiteScore,
            openingDrawScore: this.state.relatedOpeningsList[openingIndex].openingDrawScore,
            openingBlackScore: this.state.relatedOpeningsList[openingIndex].openingBlackScore,
            
            selectedMoveIndex: this.state.relatedOpeningsList[openingIndex].openingFENs.length - 1,
        });
        this.searchRelated(this.state.relatedOpeningsList[openingIndex].openingMoves, this.state.relatedOpeningsList[openingIndex].openingName);
        this.state.browsingHistory.push(this.state.relatedOpeningsList[openingIndex].openingName);
    };

    render() {
        const searchResults = this.state.openingsList.map(
            (x, i) => <Opening selectionHandler={() => this.selectOpeningHandler(i)} openingECO={x.openingECO} openingName={x.openingName} selected={this.state.openingName === x.openingName} />
        );

        const searchResultsDisplay = searchResults.length > 0 ? searchResults : (
            <div className={classes.NoResults}>No openings found...</div>
        );

        const relatedOpeningsResults = this.state.relatedOpeningsList.map(
            (x, i) => <Opening selectionHandler={() => this.selectRelatedOpeningHandler(i)} openingECO={x.openingECO} openingName={x.openingName} selected={this.state.openingName === x.openingName} />
        );

        const relatedOpeningsResultsDisplay = relatedOpeningsResults.length > 0 ? relatedOpeningsResults : (
            <div className={classes.NoResults}>No child openings found...</div>
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
                        <div className={classes.SubTitle}>
                            OPENING VIEWER
                        </div>
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
                                <td className={classes.Filler}><button onClick={() => this.selectFromNameHandler(this.state.browsingHistory[this.state.browsingHistory.length - 2])} disabled={this.state.browsingHistory.length <= 1}><i class="fa fa-arrow-left" /></button></td>
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

                <div>
                    {/* SIDE BOARD */}
                    <Board openingFEN={this.state.openingFENs[this.state.selectedMoveIndex]} />

                    {/* DETAILS PANEL */}
                    <div className={classes.DetailsPanel}>
                        <div className={classes.SubTitle}>DETAILS</div>
                        <div className={classes.Details}>
                            <div><b>Name/s:</b> {this.state.openingName}</div>
                            <div><b>ECO Category:</b> [{this.state.openingECO}] {ECOCategories[this.state.openingECO.substring(0, 1)]}</div>
                            <div><b>Avg. Scores:</b></div>
                            <div className={classes.Statistics}>
                                <div className={classes.StatisticsWhite} style={{ flex: `1 1 ${this.state.openingWhiteScore}%` }}>{this.state.openingWhiteScore}</div>
                                <div className={classes.StatisticsDraw} style={{ flex: `1 1 ${this.state.openingDrawScore}%` }}>{this.state.openingDrawScore}</div>
                                <div className={classes.StatisticsBlack} style={{ flex: `1 1 ${this.state.openingBlackScore}%` }}>{this.state.openingBlackScore}</div>
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