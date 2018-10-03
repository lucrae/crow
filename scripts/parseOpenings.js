const fs = require('fs');
const csv = require('csv-parser');
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

let openings = []

let i = 0;

fs.createReadStream('./openings_data.csv')
    .pipe(csv())
    .on('data', function (data) {
        try {
            let opening = {
                openingIndex: i,
                openingECO: data.openingECO,
                openingName: data.openingName,
                openingMoves: data.openingMoves,
                openingFENs: createFENList(data.openingMoves),
                openingSubcategory: data.openingSubcategory,
                openingGamesPlayed: data.openingGamesPlayed,
                openingWhiteScore: data.openingWhiteScore,
                openingDrawScore: data.openingDrawScore,
                openingBlackScore: data.openingBlackScore,
            };
            i += 1;

            openings.push(opening);

            console.log('DONE', opening);
        }
        catch (err) {
            console.log(err);
        }
    })
    .on('end', function () {
        console.log('end');

        let json = JSON.stringify(openings);
        fs.writeFile('openings.json', json, 'utf8');

        console.log('written');
    });