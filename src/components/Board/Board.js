import React from 'react';

import BoardSquare from './BoardSquare/BoardSquare'
import classes from './Board.css';

function parseFEN(FEN) {
    let board = []
    let FENItems = FEN.split('')

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
            boardMap.push(<BoardSquare squareColor="D" squarePiece={board[i]} />);
        } else {
            boardMap.push(<BoardSquare squareColor="L" squarePiece={board[i]} />);
        }
    };

    return boardMap;
}

class Board extends React.Component {
    render() {
        let FEN = this.props.openingFEN;
        let board = parseFEN(FEN);
        let boardMap = mapBoard(board);

        return (
            <div className={classes.Board}>
                {boardMap}
            </div>
        );
    };
};

export default Board;