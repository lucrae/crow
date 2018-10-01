let Chess = require('./chess').Chess;

function createFENList(pgn) {
    let chess = new Chess();

    chess.load_pgn(pgn);

    let moves = chess.history();
    let tempChess = new Chess();
    let FENList = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR']

    for (let i = 0; i < moves.length; i++) {
        let move = moves[i]
        tempChess.move(move);
        FENList.push(tempChess.fen().split(" ")[0])
    };

    return FENList;
}

let FENList = createFENList('1.e4 e5 2.Nf3 Nc6 3.Bb5');

console.log(FENList)