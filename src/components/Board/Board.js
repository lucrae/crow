import React from 'react';

import BoardSquare from './BoardSquare/BoardSquare'
import classes from './Board.css';

const boardColorStyles = {
    classic: {
        lightSquare: '#f0d9b5',
        darkSquare: '#b58863',
        border: '#241e1a',
    },
    cool: {
        lightSquare: '#dee3e6',
        darkSquare: '#8ca2ad',
        border: '#1e3d4d',
    },
}

const boardColors = boardColorStyles.classic;

function parseFEN(FEN, flipped=false) {
    let board = []
    let FENItems = FEN.split('')

    if (flipped) {
        FENItems = FEN.split('').reverse()
    }

    FENItems.forEach(
        function(item) {
            if (item !== '/') {
                if (isNaN(item)) {
                    board.push(item);
                } else {
                    for (let i = 0; i < parseInt(item, 10); i++) {
                        board.push(' ');
                    }
                }
            }
        }
    )

    return board;
}

function mapBoard(board) {
    let boardMap = [];

    for (let i = 0; i < board.length; i++) {
        let rowIndex = Math.floor(i / 8);
        let columnIndex = i - rowIndex * 8;
        if ((rowIndex + columnIndex) % 2) {
            boardMap.push(<BoardSquare squareColor="D" squarePiece={board[i]} style={{'backgroundColor': boardColors.darkSquare}} />);
        } else {
            boardMap.push(<BoardSquare squareColor="L" squarePiece={board[i]} style={{'backgroundColor': boardColors.lightSquare}} />);
        }
    };

    return boardMap;
}

class Board extends React.Component {
    render() {
        let FEN = this.props.openingFEN;
        let board = parseFEN(FEN, this.props.flipped);
        let boardMap = mapBoard(board);

        return (
            <div className={classes.Board} style={{ 'border': `4px solid ${boardColors.border}`}}>
                {boardMap}
            </div>
        );
    };
};

export default Board;