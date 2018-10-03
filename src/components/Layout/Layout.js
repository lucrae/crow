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

        flipped: false,
    };

    componentDidMount() {
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 37) {this.moveIndexBackHandler()}
            if (e.keyCode === 40) {this.moveIndexStartHandler()}
            if (e.keyCode === 39) {this.moveIndexForwardHandler()}
            if (e.keyCode === 38) {this.moveIndexEndHandler()}
        });
    }

    search = e => {
        const searchValue = e.target.value.toLowerCase();
        const openingsList = openings.filter(opening => {
            const name = opening.openingName.toLowerCase();
            const ECO = opening.openingECO.toLowerCase();
            const moves = opening.openingMoves.substring(0, searchValue.length);
            return searchValue.length === 0 || (searchValue.length > 0 && (name.includes(searchValue) || (ECO === searchValue) || (moves === searchValue)));
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

    flipBoard = () => {
        let is_flipped = this.state.flipped;
        this.setState({ flipped: !is_flipped });
    }

    percentageDisplay = (n) => {
        const total_games_played = 15185230;
        let p = ((n / total_games_played) * 100).toFixed(2);

        // 30370
        let p_display;
        if (n < 1000) {
            p_display = '<0.01% very rare';
        } else if (n < 5000) {
            p_display = `${p}% rare`;
        } else if (n < 20000) {
            p_display = `${p}% uncommon`;
        } else if (n < 40000) {
            p_display = `${p}% common`;
        } else if (n < 10000) {
            p_display = `${p}% popular`;
        } else if (n < 300000) {
            p_display = `${p}% very popular`;
        } else {
            p_display = `${p}% extremely popular`;
        }

        return p_display;
    }



    render() {
        const searchResults = this.state.openingsList.map(
            (x, i) => <Opening selectionHandler={() => this.selectOpening(i, this.state.openingsList)} openingECO={x.openingECO} openingSubcategory={x.openingSubcategory} openingName={x.openingName} selected={this.state.openingIndex === x.openingIndex} />
        );

        const searchResultsDisplay = searchResults.length > 0 ? searchResults : (
            <div className={classes.NoResults}>No openings found...</div>
        );

        const relatedOpeningsResults = this.state.relatedOpeningsList.map(
            (x, i) => <Opening selectionHandler={() => this.selectOpening(i, this.state.relatedOpeningsList)} openingECO={x.openingECO} openingSubcategory={x.openingSubcategory} openingName={x.openingName} selected={this.state.openingIndex === x.openingIndex} />
        );

        const relatedOpeningsResultsDisplay = relatedOpeningsResults.length > 0 ? relatedOpeningsResults : (
            <div className={classes.NoResults}>Opening is longest in its family...</div>
        );

        const popularity = this.percentageDisplay(openings[this.state.openingIndex].openingGamesPlayed)

        const opening = {
            ECO: openings[this.state.openingIndex].openingECO,
            name: openings[this.state.openingIndex].openingName,
            FENs: openings[this.state.openingIndex].openingFENs,
            moves: openings[this.state.openingIndex].openingMoves,
            subcategory: openings[this.state.openingIndex].openingSubcategory,
            gamesPlayed: openings[this.state.openingIndex].openingGamesPlayed,
            whiteScore: openings[this.state.openingIndex].openingWhiteScore,
            drawScore: openings[this.state.openingIndex].openingDrawScore,
            blackScore: openings[this.state.openingIndex].openingBlackScore,
        };

        return (
            <div className={classes.Layout}>
                
                <div className={classes.Side}>
                    {/* HEAD PANEL */}
                    <div className={classes.HeadPanel}>
                        <i className="fa fa-crow" />
                        <span className={classes.HeadMain}>CROW</span> <span className={classes.HeadSub}>ECO DATABASE BROWSER</span>
                    </div>

                    {/* NAVIGATOR */}
                    <div className={classes.SidePanel}>
                        <div className={classes.SubTitle}>
                            OPENING VIEWER
                        </div>
                        <div className={classes.Title}>
                            <span className={classes.TitleECO}>{opening.ECO} [{opening.subcategory}] </span>
                            {opening.name}
                        </div>
                        <div className={classes.PGN}>
                            {opening.moves}
                        </div>
                        <br />
                        <div className={classes.Navigator}>
                            <table>
                                <tbody><tr>
                                    <td className={classes.Filler}><button onClick={this.selectLastOpening} disabled={this.state.browsingHistory.length <= 1}><i className="fa fa-arrow-left" /></button></td>
                                    
                                    <td><button onClick={this.moveIndexStartHandler} disabled={this.state.moveIndex <= 0}><i className="fa fa-fast-backward" /></button></td>
                                    <td><button onClick={this.moveIndexBackHandler} disabled={this.state.moveIndex <= 0}><i className="fa fa-step-backward" /></button></td>
                                    <td className={classes.MoveIndex}>{this.state.moveIndex + 1} / {opening.FENs.length}</td>
                                    <td><button onClick={this.moveIndexForwardHandler} disabled={this.state.moveIndex >= opening.FENs.length - 1}><i className="fa fa-step-forward" /></button></td>
                                    <td><button onClick={this.moveIndexEndHandler} disabled={this.state.moveIndex >= opening.FENs.length - 1}><i className="fa fa-fast-forward" /></button></td>
                
                                    <td className={classes.Filler}><button onClick={this.flipBoard}><i className="fa fa-sync-alt" /></button></td>
                                </tr></tbody>                            
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
                                <tbody>
                                    {searchResultsDisplay}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className={classes.Footer}>
                        Lucien Rae Gentil &copy; 2018
                    </div>
                </div>

                <div>
                    {/* BOARD */}
                    <Board openingFEN={opening.FENs[this.state.moveIndex]} flipped={this.state.flipped} />

                    {/* DETAILS PANEL */}
                    <div className={classes.DetailsPanel}>
                        <div className={classes.SubTitle}> ECO DETAILS [<span className={classes.Highlight}>{opening.ECO}</span>]</div>
                        <div className={classes.Details}>
                            <div><i className='fa fa-book' /><b>Category:</b> [Vol. {opening.ECO.substring(0, 1)}] {ECOCategories[opening.ECO.substring(0, 1)]}</div>
                            <div><i className='fa fa-folder-open' /><b>Subcategory:</b> [Sub. {opening.ECO.substring(1, 3)}] {opening.subcategory}</div>
                            <div><i className='fa fa-chess-king' /><b>Games Played:</b> {opening.gamesPlayed} ({popularity})</div>
                            <div><i className='fa fa-chart-bar' /><b>Avg. Scores:</b> [{opening.whiteScore}%, {opening.drawScore}%, {opening.blackScore}%]</div>
                            <div className={classes.Statistics}>
                                <div className={classes.StatisticsWhite} style={{ flex: `1 1 ${opening.whiteScore}%` }}>{opening.whiteScore}</div>
                                <div className={classes.StatisticsDraw} style={{ flex: `1 1 ${opening.drawScore}%` }}>{opening.drawScore}</div>
                                <div className={classes.StatisticsBlack} style={{ flex: `1 1 ${opening.blackScore}%` }}>{opening.blackScore}</div>
                            </div>
                        </div>


                        <div>Sub-Variants ({relatedOpeningsResults.length})</div>
                        <div className={classes.Browser}>
                            <table>
                                <tbody>
                                    {relatedOpeningsResultsDisplay}
                                </tbody>
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