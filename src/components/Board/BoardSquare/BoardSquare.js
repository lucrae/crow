import React from 'react';

import classes from './BoardSquare.css';

// import piece svgs
import KPiece from './PieceIcons/whiteKing.svg';
import QPiece from './PieceIcons/whiteQueen.svg';
import RPiece from './PieceIcons/whiteRook.svg';
import BPiece from './PieceIcons/whiteBishop.svg';
import NPiece from './PieceIcons/whiteKnight.svg';
import PPiece from './PieceIcons/whitePawn.svg';
import kPiece from './PieceIcons/blackKing.svg';
import qPiece from './PieceIcons/blackQueen.svg';
import rPiece from './PieceIcons/blackRook.svg';
import bPiece from './PieceIcons/blackBishop.svg';
import nPiece from './PieceIcons/blackKnight.svg';
import pPiece from './PieceIcons/blackPawn.svg';

const pieceSize = '64';

const pieceSet = {
    'K': KPiece,
    'Q': QPiece,
    'R': RPiece,
    'B': BPiece,
    'N': NPiece,
    'P': PPiece,
    'k': kPiece,
    'q': qPiece,
    'r': rPiece,
    'b': bPiece,
    'n': nPiece,
    'p': pPiece,
    '': null,
};

const squareColors = {
    'L': classes.LightSquare,
    'D': classes.DarkSquare,
}

const boardSquare = (props) => {
    const piece = Boolean(pieceSet[props.squarePiece]) && <img src={pieceSet[props.squarePiece]} alt="FISH" width={pieceSize} />;
    return (
        <div className={squareColors[props.squareColor]} style={props.style}>{piece}</div>
    )
}

export default boardSquare;