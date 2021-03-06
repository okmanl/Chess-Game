// goal: implement capturable pieces. 
// sub-goal: highlight a piece if it contains a capturable piece    dropPiece is the place to focus on


// problem if king is threatened, but another piece can capture the threat, we need to highlight that square 
// and only that square. 

// need to add properties, one to piece called "threatens king"
// another to king called number of threats. 
//

// todo: this.searchForThreat


var cannon;
var chessMap = new Map();
var pieces = [];
var playerTurn = 1;
var isWhiteKingChecked = false;
var isBlackKingChecked = false;

const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

var alphabetPositions = new Map();
var alphabetPositionsKeys = new Map();
for (var i = 0; i < alphabets.length; i++) {
    alphabetPositionsKeys.set(alphabets[i], i);
    alphabetPositions.set(i, alphabets[i]);
}


function piece(color, pieceType, image, isCaptured, currentSquare) {

    this.color = color; // string
    this.pieceType = pieceType; // string
    this.image = image; // string
    this.isCaptured = isCaptured; // bool
    this.currentSquare = currentSquare; // tuple

    this.threatensKing = false;

    this.searchForKing = function(event) {

        if (this.pieceType === "knight") {
            this.horseMovement(this);
        }

    };

};

function king(color, pieceType, image, isCaptured, currentSquare) {
    piece.call(this, color, pieceType, image, isCaptured, currentSquare);
    this.numberOfThreats = 0;


    this.kingMovement = function(event) {

        if (playerTurn === 1 && this.color === "white" || playerTurn === 2 && this.color === "black") {

            resetColors();
            load(event.target);

            this.highlightKingSquares(this);


        }
    }
    this.highlightKingSquares = function(kng) {
        var numberPointer = kng.currentSquare[1] + 1;
        for (var layer = 0; layer < 3; layer++) {
            for (var square = 0; square < 3; square++) {

                var column = alphabetPositions.get(alphabetPositionsKeys.get(kng.currentSquare[0]) - 1 + square);

                if (square === 1 && numberPointer === kng.currentSquare[1]) {
                    // Check to see if there is any direct threats. If so, we set the globalVariable, 
                    // isWhiteKingChecked or isBlackKingChecked to true.

                    if (isBishopThreat(column, numberPointer, kng.color)) {
                        isWhiteKingChecked = true;
                    }

                } else // threats need two arguments, 
                if (!(isRookThreat(kng) ||
                        isBishopThreat(column, numberPointer, kng.color) ||
                        pawnThreat(kng) ||
                        horseThreat(kng) ||
                        queenThreat(kng) ||
                        kingThreat(kng))

                ) {

                    // $ letter = , number = numberPointer . css . green
                    $(`#${column}${numberPointer}`).
                    css("background-color", "green");

                }

            }
            numberPointer--;

        }
    };

};


function isRookThreat(kng) {
    return false;
}

function isBishopThreat(column, numberPointer, kingsColor) {

    // if one of dBL, dBR ... etc... is true, we return true. 

    var diagBottomLeftSearchHasThreat = searchDiagBottomLeft(column, numberPointer, kingsColor);

    var diagBottomRightSearchHasThreat = searchDiagBottomRight(column, numberPointer, kingsColor);

    var diagTopRightSearchHasThreat = searchDiagTopRight(column, numberPointer, kingsColor);

    var diagTopLeftSearchHasThreat = searchDiagTopLeft(column, numberPointer, kingsColor);



    if (diagBottomLeftSearchHasThreat === false &&
        diagBottomRightSearchHasThreat === false &&
        diagTopRightSearchHasThreat === false &&
        diagTopLeftSearchHasThreat === false) {

        return false;

    } else return true;



};

function searchDiagBottomLeft(leftLetterPointer, bottomLeftPath, kingsColor) {

    var squareIsOccupied = false;

    while (!squareIsOccupied) {
        bottomLeftPath--;
        leftLetterPointer = alphabetPositions.get(alphabetPositionsKeys.get(leftLetterPointer) - 1);
        var piece = chessMap.get($(`#${leftLetterPointer}${bottomLeftPath}`).children().attr("id"));

        if ($(`#${leftLetterPointer}${bottomLeftPath}`).children().length === 1 && piece.pieceType !== "king") {
            if (piece.pieceType === "bishop") {
                if ((kingsColor === "white" && piece.color === "black") || (kingsColor === "black" && piece.color === "white")) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else if (bottomLeftPath <= 0) {
            return false;
        }
    }

    return false;
};

// traverseRight = 
function searchDiagBottomRight(column, row, kingsColor) {
    while (true) {
        row--;
        column = alphabetPositions.get(alphabetPositionsKeys.get(column) + 1);

        var pieceHighlighted = chessMap.get($(`#${column}${row}`).children().attr("id"));

        if ($(`#${column}${row}`).children().length === 1 && pieceHighlighted.pieceType !== "king") {
            if (pieceHighlighted.pieceType === "bishop") {
                if ((kingsColor === "white" && pieceHighlighted.color === "black") || (kingsColor === "black" && pieceHighlighted.color === "white")) {
                    return true;
                } else {
                    return false;
                }

            } else {
                return false;
            }
        } else if (row <= 0) {
            return false;
        }
    }

    // unreachable statement, but it doesn't matter.
    return false;
};

function searchDiagTopRight(column, row, kingsColor) {

    while (true) {
        row++;
        column = alphabetPositions.get(alphabetPositionsKeys.get(column) + 1);

        var pieceHighlighted = chessMap.get($(`#${column}${row}`).children().attr("id"));

        if ($(`#${column}${row}`).children().length === 1 && pieceHighlighted.pieceType !== "king") {
            if (pieceHighlighted.pieceType === "bishop") {
                if ((kingsColor === "white" && pieceHighlighted.color === "black") || (kingsColor === "black" && pieceHighlighted.color === "white")) {
                    return true;
                } else {
                    return false;
                }

            } else {
                return false;
            }
        } else if (row >= 9) {
            return false;
        }
    }
    return false;


}

function searchDiagTopLeft(column, row, kingsColor) {


    while (true) {
        row++;
        column = alphabetPositions.get(alphabetPositionsKeys.get(column) - 1);

        var pieceHighlighted = chessMap.get($(`#${column}${row}`).children().attr("id"));

        if ($(`#${column}${row}`).children().length === 1 && pieceHighlighted.pieceType !== "king") {
            if (pieceHighlighted.pieceType === "bishop") {
                if ((kingsColor === "white" && pieceHighlighted.color === "black") || (kingsColor === "black" && pieceHighlighted.color === "white")) {
                    return true;
                } else {
                    return false;
                }

            } else {
                return false;
            }
        } else if (row >= 9) {
            return false;
        }
    }
    return false;

}


function horseThreat(kng) {
    return false;
}

function queenThreat(kng) {
    return false;
}

function pawnThreat(kng) {
    return false;
}

function kingThreat(kng) {
    return false;
}

function knight(color, pieceType, image, isCaptured, currentSquare) {
    piece.call(this, color, pieceType, image, isCaptured, currentSquare);
    this.horseMovement = function(event) {
            if (playerTurn === 1 && this.color === "white" && !isWhiteKingChecked || playerTurn === 2 && this.color === "black" && !isBlackKingChecked) {
                resetColors();
                load(event.target);

                // highlights possible knight movements. 
                for (var i = 0; i < 2; i++) {

                    var upperLeftMovement = `#${alphabetPositions.get(alphabetPositionsKeys.get(this.currentSquare[0]) - 2 + i)}${this.currentSquare[1] + 1 + i}`;
                    var lowerLeftMovement = `#${alphabetPositions.get(alphabetPositionsKeys.get(this.currentSquare[0]) - 2 + i)}${this.currentSquare[1] - i - 1}`;
                    var upperRightMovement = `#${alphabetPositions.get(alphabetPositionsKeys.get(this.currentSquare[0]) + 2 - i)}${this.currentSquare[1] + i + 1}`;
                    var lowerRightMovement = `#${alphabetPositions.get(alphabetPositionsKeys.get(this.currentSquare[0]) + 2 - i)}${this.currentSquare[1] - i - 1}`;



                    $(upperLeftMovement).css("background-color", "green");
                    $(lowerLeftMovement).css("background-color", "green");
                    $(upperRightMovement).css("background-color", "green");
                    $(lowerRightMovement).css("background-color", "green");

                    var arrayOfHorseMovements = [];

                    arrayOfHorseMovements.push(upperLeftMovement, upperRightMovement, lowerLeftMovement, lowerRightMovement);

                    this.checkKing(arrayOfHorseMovements);
                }

            } else if (playerTurn === 1 &&
                this.color === "white" &&
                isWhiteKingChecked &&
                chessMap.get("whiteKing").numberOfThreats === 1) {

                this.searchForThreat();

            } else if (playerTurn === 2 &&
                this.color === "black" &&
                isBlackKingChecked &&
                chessMap.get("blackKing").numberOfThreats === 1) {

                this.SearchForThreat();
                // search for threat. 
            }

        }
        // todo fix the if statement in this function to search for whiteKing.
    this.searchForThreat = function() {
        var horseMovements = [];

        for (var i = 0; i < 2; i++) {

            var upperLeftMovement = `#${alphabetPositions.get(alphabetPositionsKeys.get(this.currentSquare[0]) - 2 + i)}${this.currentSquare[1] + 1 + i}`;
            var lowerLeftMovement = `#${alphabetPositions.get(alphabetPositionsKeys.get(this.currentSquare[0]) - 2 + i)}${this.currentSquare[1] - i - 1}`;
            var upperRightMovement = `#${alphabetPositions.get(alphabetPositionsKeys.get(this.currentSquare[0]) + 2 - i)}${this.currentSquare[1] + i + 1}`;
            var lowerRightMovement = `#${alphabetPositions.get(alphabetPositionsKeys.get(this.currentSquare[0]) + 2 - i)}${this.currentSquare[1] - i - 1}`;



            if (upperLeftMovement.children().length() === 1) {
                if (chessMap.get(upperLeftMovement.children().attr("id")).threatensKing) {
                    $(upperLeftMovement).css("background-color", "green");
                }
            }
            if (lowerLeftMovement.children().length() === 1) {
                if (chessMap.get(lowerLeftMovement.children().attr("id")).threatensKing) {
                    $(lowerLeftMovement).css("background-color", "green");
                }
            }
            if (upperRightMovement.children().length() === 1) {
                if (chessMap.get(upperRightMovement.children().attr("id")).threatensKing) {
                    $(upperRightMovement).css("background-color", "green");
                }
            }
            if (lowerRightMovement.children().length() === 1) {
                if (chessMap.get(lowerRightMovement.children().attr("id")).threatensKing) {
                    $(lowerRightMovement).css("background-color", "green");
                }
            }
        }


    };

    this.checkKing = function(arrayOfHorseMovements) {

        for (var i = 0; i < arrayOfHorseMovements.length; i++) {
            var squareOccupant = chessMap.get($(arrayOfHorseMovements[i]).children().attr("id"));

            if (squareOccupant instanceof king && squareOccupant.color === "white" && this.color === "black") {
                isWhiteKingChecked = true;
                this.threatensKing = true;
                squareOccupant.numberOfThreats += 1;
            } else if (squareOccupant instanceof king && squareOccupant.color === "black" && this.color === "white") {
                isBlackKingChecked = true;
                this.threatensKing = true;
                squareOccupant.numberOfThreats += 1;
            }


        }

    }
}


function pawn(color, pieceType, image, isCaptured, currentSquare, canAdvanceTwice) {
    piece.call(this, color, pieceType, image, isCaptured, currentSquare);
    this.canAdvanceTwice = canAdvanceTwice;
};


// function add(x, y) {
//     return x + y + 1;
// }


var unitTests = {};

unitTests.addititon = function(additionMethod) {
    var test = 5;
    var testTwo = 5;

    result = 10;

    if (additionMethod(test, testTwo) === result) {

        return true;
    } else {
        return false;
    }



};



function dropPiece(ev) {

    // gives names to the ev.target properties. 
    var occupiedSquareColor = $(ev.target).parents().css("background-color");
    var squareColor = $(ev.target).css("background-color");
    var colorGreen = "rgb(0, 128, 0)";
    var occupiedSquareID = $(ev.target).parent().attr("id");



    if (occupiedSquareColor === colorGreen) {
        var squareAlphabet = occupiedSquareID.charAt(0);
        var squareNumber = parseInt(occupiedSquareID.charAt(1));
        var pieceMoved = chessMap.get(cannon.id);

        $(ev.target).parent().append(cannon);
        ev.target.remove();


        pieceMoved.currentSquare[0] = squareAlphabet;
        pieceMoved.currentSquare[1] = squareNumber;
        if (pieceMoved instanceof pawn) {
            pieceMoved.canAdvanceTwice = false;
        }


        if (pieceMoved instanceof king && pieceMoved.color === "white") {
            isWhiteKingChecked = false;
            pieceMoved.numberOfThreats = 0;
        }

        if (pieceMoved instanceof king && pieceMoved.color === "black") {
            isBlackKingChecked = false;
            pieceMoved.numberOfThreats = 0;
        }

        switchTurns();
        resetColors();

    } else if (squareColor === colorGreen) {
        var squareAlphabet = ev.target.id.charAt(0);
        var squareNumber = parseInt(ev.target.id.charAt(1));
        var pieceMoved = chessMap.get(cannon.id);

        ev.target.append(cannon);

        pieceMoved.currentSquare[0] = squareAlphabet;
        pieceMoved.currentSquare[1] = squareNumber;
        if (pieceMoved instanceof pawn) {
            pieceMoved.canAdvanceTwice = false;
        }

        if (pieceMoved instanceof king && pieceMoved.color === "white") {
            isWhiteKingChecked = false;
        }

        if (pieceMoved instanceof king && pieceMoved.color === "black") {
            isBlackKingChecked = false;
        }

        pieceMoved.searchForKing(ev);
        switchTurns();
        resetColors();
    }
};

function switchTurns() {

    if (playerTurn === 1) {
        playerTurn = 2;
    } else {
        playerTurn = 1;
    }
}

function allowDrop(ev) {
    ev.preventDefault();
};

function drag(ev) {

    ev.dataTransfer.setData("text", ev.target.id);
};

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
};


function createBoard() {

    let strHTML = "";
    let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    let strr = "asd"
    for (var row = 0; row < 8; row++) {
        strHTML += "<div>";
        for (var column = 0; column < 8; column++) {
            if ((column + row) % 2 === 0) {
                strHTML += `<div class="white_square" id="${alphabets[column]}${8-row}"
                ondrop="drop(event)" onclick="dropPiece(event)"></div>`;
            } else {
                strHTML += `<div class="black_square" id="${alphabets[column]}${8-row}"
                 ondrop="drop(event)" onclick="dropPiece(event)"></div>`;
            }
        }
        strHTML += "</div>";
    }
    $("#chessboard").html(strHTML);
};


$(document).ready(function() {

    initializePieces();
    alert("you're amazing =)");



});


// This function uses the chessMap object. We map each pieces object with its HTML ID tag. 
function initializePieces() {

    initializePawns();
    initializeWhiteBishops();
    initializeBlackBishops();
    initializeWhiteKnights();
    initializeBlackKnights();
    initializeKings();

};

function initializeKings() {
    pieces.push(new king("white", "king", "/Users/ericgumba/Chess-Game/images/wK.png", false, [alphabets[4], 1]));
    $(`#${alphabets[4]}1`).append(`<img src=${pieces[24].image} id="whiteKing" class="king" onclick="pieces[24].kingMovement(event)" width="50" height="50">`);

    chessMap.set("whiteKing", pieces[24]);

    pieces.push(new king("black", "king", "/Users/ericgumba/Chess-Game/images/bK.png", false, [alphabets[4], 8]));
    $(`#${alphabets[4]}8`).append(`<img src=${pieces[25].image} id="blackKing" class="king" onclick="pieces[25].kingMovement(event)" width="50" height="50">`);

    chessMap.set("blackKing", pieces[25]);
};

function initializePawns() {

    let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (var i = 0; i < 16; i++) {
        if (i < 8) {
            pieces.push(new pawn("white", "pawn", "/Users/ericgumba/Chess-Game/images/wP.png", false, [alphabets[i], 2], true));
            $("#" + alphabets[i] + "2").append(`<img src="/Users/ericgumba/Chess-Game/images/wP.png" id="whitePawn${i+1}" class="pawn" onclick="highlightedWP(event)" width="50" height="50">`);
            chessMap.set(`whitePawn${i+1}`, pieces[i]);
        } else {
            pieces.push(new pawn("black", "pawn", "/Users/ericgumba/Chess-Game/images/bP.png", false, [alphabets[i - 8], 7], true));
            $("#" + alphabets[i - 8] + "7").append(`<img src="/Users/ericgumba/Chess-Game/images/bP.png" id="blackPawn${i-7}" class="pawn" onclick="highlightedBP(event)" width="50" height="50">`);
            chessMap.set(`blackPawn${i-7}`, pieces[i]);
        }
    }
};



function initializeWhiteBishops() {

    let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    pieces.push(new piece("white", "bishop", "/Users/ericgumba/Chess-Game/images/wB.png", false, [alphabets[2], 1]));
    $("#" + alphabets[2] + "1").append(`<img src="/Users/ericgumba/chess-game/images/wB.png" id="whiteBishopLeft" class="bishop" onclick="highlightedWB(event)" width="50" height="50">`);

    // pieces array should be at length = 16, therefore we map whiteBishopLeft to pieces 16. 
    chessMap.set(`whiteBishopLeft`, pieces[16]);

    pieces.push(new piece("white", "bishop", "/Users/ericgumba/Chess-Game/images/wB.png", false, [alphabets[5], 1]));
    $("#" + alphabets[5] + "1").append(`<img src="/Users/ericgumba/chess-game/images/wB.png" id="whiteBishopRight" class="bishop" onclick="highlightedWB(event)" width="50" height="50">`);
    chessMap.set(`whiteBishopRight`, pieces[17]);


};



function initializeBlackBishops() {

    let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    pieces.push(new piece("black", "bishop", "/Users/ericgumba/Chess-Game/images/bB.png", false, [alphabets[2], 8]));
    $(`#${alphabets[2]}8`).append(`<img src="/Users/ericgumba/chess-game/images/bB.png" id="blackBishopLeft" class="bishop" onclick="highlightedBlackBishop(event)" width="50" height="50">`);

    chessMap.set("blackBishopLeft", pieces[18]);

    pieces.push(new piece("black", "bishop", "/Users/ericgumba/Chess-Game/images/bB.png", false, [alphabets[5], 8]));
    $(`#${alphabets[5]}8`).append(`<img src="/Users/ericgumba/chess-game/images/bB.png" id="blackBishopRight" class="bishop" onclick="highlightedBlackBishop(event)" width="50" height="50">`);


    chessMap.set("blackBishopRight", pieces[19]);

};

function initializeWhiteKnights() {

    pieces.push(new knight("white", "knight", "/Users/ericgumba/Chess-Game/images/wN.png", false, [alphabets[1], 1]));
    $(`#${alphabets[1]}1`).append(`<img src="/Users/ericgumba/chess-game/images/wN.png"
    id="whiteKnightLeft" 
    class="knight" 
    onclick="pieces[20].horseMovement(event)" 
    width="50" 
    height="50">`);

    chessMap.set("whiteKnightLeft", pieces[20]);


    pieces.push(new knight("white", "knight", "/Users/ericgumba/Chess-Game/images/wN.png", false, [alphabets[6], 1]));
    $(`#${alphabets[6]}1`).append(`<img src="/Users/ericgumba/chess-game/images/wN.png"
    id="whiteKnightRight" 
    class="knight" 
    onclick="pieces[21].horseMovement(event)" 
    width="50" 
    height="50">`);

    chessMap.set("whiteKnightRight", pieces[21]);
};

function initializeBlackKnights() {


    pieces.push(new knight("black", "knight", "/Users/ericgumba/Chess-Game/images/bN.png", false, [alphabets[1], 8]));
    $(`#${alphabets[1]}8`).append(`<img src="/Users/ericgumba/chess-game/images/bN.png"
    id="blackKnightRight" 
    class="knight" 
    onclick="pieces[22].horseMovement(event)" 
    width="50" 
    height="50">`);

    chessMap.set("blackKnightRight", pieces[22]);


    pieces.push(new knight("black", "knight", "/Users/ericgumba/Chess-Game/images/bN.png", false, [alphabets[6], 8]));
    $(`#${alphabets[6]}8`).append(`<img src="/Users/ericgumba/chess-game/images/bN.png"
    id="blackKnightLeft" 
    class="knight" 
    onclick="pieces[23].horseMovement(event)" 
    width="50" 
    height="50">`);

    chessMap.set("blackKnightLeft", pieces[23]);

};
// This function highlights possible square moves and is called when a piece is clicked on. The onClick function 
// is declared in initializePieces()

function highlightedWP(event) {
    if (playerTurn === 1 && !isWhiteKingChecked) {
        resetColors();
        load(event.target);
        var currentHighlightedPiece = chessMap.get(event.target.id);

        // data structure to use would be a map... Or... 
        // array?
        // linked list?
        var pawnAttackPositions = new Map();
        var pawnAttackPositionKeys = new Map();
        let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (var i = 0; i < alphabets.length; i++) {
            pawnAttackPositions.set(alphabets[i], i);
            pawnAttackPositionKeys.set(i, alphabets[i]);
        }

        // now we check to see if the pawn can attack diagonally 
        var letter = currentHighlightedPiece.currentSquare[0];
        var attackLeft = pawnAttackPositionKeys.get(pawnAttackPositions.get(letter) - 1);
        var attackRight = pawnAttackPositionKeys.get(pawnAttackPositions.get(letter) + 1);

        var diagLeftOccupantSize = $(`#${attackLeft}${currentHighlightedPiece.currentSquare[1]+1}`).children().length;
        var diagRightOccupantSize = $(`#${attackRight}${currentHighlightedPiece.currentSquare[1]+1}`).children().length;

        var forwardOne = `${currentHighlightedPiece.currentSquare[1]+1}`;
        var forwardTwo = `${currentHighlightedPiece.currentSquare[1]+2}`;


        var diagLeft = $(`#${attackLeft}${forwardOne}`);
        var diagRight = $(`#${attackRight}${forwardOne}`);

        var forwardOneOccupantSize = $(`#${currentHighlightedPiece.currentSquare[0]}${currentHighlightedPiece.currentSquare[1]+1}`).children().length;
        var forwardTwoOccupantSize = $(`#${currentHighlightedPiece.currentSquare[0]}${currentHighlightedPiece.currentSquare[1]+2}`).children().length;




        if (currentHighlightedPiece.canAdvanceTwice === true) {
            if (forwardOneOccupantSize === 0) {
                $(`#${letter}${forwardOne}`).css("background-color", "green");
            }
            if (forwardTwoOccupantSize === 0 && forwardOneOccupantSize === 0) {
                $(`#${currentHighlightedPiece.currentSquare[0]}${currentHighlightedPiece.currentSquare[1]+2}`).css("background-color", "green");
            }
        }

        if (diagLeftOccupantSize === 1) {
            diagLeft.css("background-color", "green");
        }

        if (diagRightOccupantSize === 1) {
            diagRight.css("background-color", "green");
        }


        if (forwardOneOccupantSize === 0) {
            $(`#${letter}${forwardOne}`).css("background-color", "green");
        }

    }
};

// highlights possible black pawn moves when clicked
function highlightedBP(event) {

    if (playerTurn === 2 && isBlackKingChecked === false) {
        resetColors();
        load(event.target);
        var currentHighlightedPiece = chessMap.get(event.target.id);



        var pawnAttackPositions = new Map();
        var pawnAttackPositionKeys = new Map();
        let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (var i = 0; i < alphabets.length; i++) {
            pawnAttackPositions.set(alphabets[i], i);
            pawnAttackPositionKeys.set(i, alphabets[i]);
        }


        var letter = currentHighlightedPiece.currentSquare[0];
        var attackLeft = pawnAttackPositionKeys.get(pawnAttackPositions.get(letter) - 1);
        var attackRight = pawnAttackPositionKeys.get(pawnAttackPositions.get(letter) + 1);

        var diagLeftOccupantSize = $(`#${attackLeft}${currentHighlightedPiece.currentSquare[1]-1}`).children().length;
        var diagRightOccupantSize = $(`#${attackRight}${currentHighlightedPiece.currentSquare[1]-1}`).children().length;


        var forwardOne = `${currentHighlightedPiece.currentSquare[1]-1}`;
        var forwardTwo = `${currentHighlightedPiece.currentSquare[1]-2}`;

        var diagLeft = $(`#${attackLeft}${forwardOne}`);
        var diagRight = $(`#${attackRight}${forwardOne}`);

        var forwardOneOccupantSize = $(`#${currentHighlightedPiece.currentSquare[0]}${currentHighlightedPiece.currentSquare[1]-1}`).children().length;
        var forwardTwoOccupantSize = $(`#${currentHighlightedPiece.currentSquare[0]}${currentHighlightedPiece.currentSquare[1]-2}`).children().length;

        if (forwardOneOccupantSize === 0) {
            $(`#${letter}${forwardOne}`).css("background-color", "green");
        }
        if (currentHighlightedPiece.canAdvanceTwice === true) {
            if (forwardTwoOccupantSize === 0 && forwardOneOccupantSize === 0) {
                $(`#${currentHighlightedPiece.currentSquare[0]}${currentHighlightedPiece.currentSquare[1]-2}`).css("background-color", "green");
            }
        }

        if (diagLeftOccupantSize === 1) {
            diagLeft.css("background-color", "green");
        }

        if (diagRightOccupantSize === 1) {
            diagRight.css("background-color", "green");
        }



    }
};

function highlightedWB(event) {

    // possible sol. 1
    // use for-loop to highlight diagonal rows, until we encounter a piece.  


    // Create a mapping for possible bishop attack positions. 

    if (playerTurn === 1 && !isWhiteKingChecked) {
        resetColors();
        load(event.target);
        var currentHighlightedPiece = chessMap.get(event.target.id);

        highlightDiagTopLeftSquaresForBishop(currentHighlightedPiece);
        highlightDiagTopRightSquaresForBishop(currentHighlightedPiece);
        highlightDiagBottomLeftSquaresForBishop(currentHighlightedPiece);
        highlightDiagBottomRightSquaresForBishop(currentHighlightedPiece);

    }
};

function highlightDiagTopLeftSquaresForBishop(currentHighlightedPiece) {

    var bishopAttackPositionNumber = new Map();
    var bishopAttackPositionLetter = new Map();
    let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (var i = 0; i < alphabets.length; i++) {
        bishopAttackPositionNumber.set(alphabets[i], i);
        bishopAttackPositionLetter.set(i, alphabets[i]);
    }

    // use while loop to highlight diagLeft and diagRight paths.

    var row = currentHighlightedPiece.currentSquare[1];
    var column = currentHighlightedPiece.currentSquare[0];

    var squareIsOccupied = false;

    // highlight diagonal top left path
    while (!squareIsOccupied) {
        row++;
        column = bishopAttackPositionLetter.get(bishopAttackPositionNumber.get(column) - 1);

        if ($(`#${column}${row}`).children().length === 1) {

            var occupant = chessMap.get($(`#${column}${row}`).children().attr("id"));

            $(`#${column}${row}`).css("background-color", "green");

            if (occupant instanceof king) {
                if (currentHighlightedPiece.color === "white" && occupant === "black") {
                    isBlackKingChecked = true;

                } else if (currentHighlightedPiece.color === "black" && occupant === "white") {
                    isWhiteKingChecked = true;
                }
            }
            squareIsOccupied = true;
        } else if (row === -1 || row === 9) {
            squareIsOccupied = true;
        } else {
            $(`#${column}${row}`).css("background-color", "green");
        }
    }

};

function highlightDiagBottomLeftSquaresForBishop(currentHighlightedPiece) {


    var bishopAttackPositionNumber = new Map();
    var bishopAttackPositionLetter = new Map();
    let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (var i = 0; i < alphabets.length; i++) {
        bishopAttackPositionNumber.set(alphabets[i], i);
        bishopAttackPositionLetter.set(i, alphabets[i]);
    }

    // use while loop to highlight diagLeft and diagRight paths.

    var row = currentHighlightedPiece.currentSquare[1];
    var column = currentHighlightedPiece.currentSquare[0];

    var squareIsOccupied = false;

    // highlight diagonal top left path
    while (!squareIsOccupied) {
        row--;
        column = bishopAttackPositionLetter.get(bishopAttackPositionNumber.get(column) - 1);

        if ($(`#${column}${row}`).children().length === 1) {

            $(`#${column}${row}`).css("background-color", "green");


            if (occupant instanceof king) {
                if (currentHighlightedPiece.color === "white" && occupant === "black") {
                    isBlackKingChecked = true;

                } else if (currentHighlightedPiece.color === "black" && occupant === "white") {
                    isWhiteKingChecked = true;
                }
            }

            squareIsOccupied = true;
        } else if (row === -1 || row === 9) {
            squareIsOccupied = true;
        } else {
            $(`#${column}${row}`).css("background-color", "green");
        }
    }

};

function highlightDiagBottomRightSquaresForBishop(currentHighlightedPiece) {

    var bishopAttackPositionNumber = new Map();
    var bishopAttackPositionLetter = new Map();
    for (var i = 0; i < alphabets.length; i++) {
        bishopAttackPositionNumber.set(alphabets[i], i);
        bishopAttackPositionLetter.set(i, alphabets[i]);
    }

    // use while loop to highlight diagLeft and diagRight paths.

    var row = currentHighlightedPiece.currentSquare[1];
    var column = currentHighlightedPiece.currentSquare[0];

    var squareIsOccupied = false;

    // highlight diagonal top left path
    while (!squareIsOccupied) {
        row--;
        column = bishopAttackPositionLetter.get(bishopAttackPositionNumber.get(column) + 1);

        if ($(`#${column}${row}`).children().length === 1) {

            $(`#${column}${row}`).css("background-color", "green");


            if (occupant instanceof king) {
                if (currentHighlightedPiece.color === "white" && occupant === "black") {
                    isBlackKingChecked = true;

                } else if (currentHighlightedPiece.color === "black" && occupant === "white") {
                    isWhiteKingChecked = true;
                }
            }

            squareIsOccupied = true;
        } else if (row === -1 || row === 9) {
            squareIsOccupied = true;
        } else {
            $(`#${column}${row}`).css("background-color", "green");
        }
    }
};

function highlightDiagTopRightSquaresForBishop(currentHighlightedPiece) {
    var bishopAttackPositionNumber = new Map();
    var bishopAttackPositionLetter = new Map();
    let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (var i = 0; i < alphabets.length; i++) {
        bishopAttackPositionNumber.set(alphabets[i], i);
        bishopAttackPositionLetter.set(i, alphabets[i]);
    }

    // use while loop to highlight diagLeft and diagRight paths.

    var row = currentHighlightedPiece.currentSquare[1];
    var column = currentHighlightedPiece.currentSquare[0];

    var squareIsOccupied = false;

    // highlight diagonal top left path
    while (!squareIsOccupied) {
        row++;
        column = bishopAttackPositionLetter.get(bishopAttackPositionNumber.get(column) + 1);

        if ($(`#${column}${row}`).children().length === 1) {

            $(`#${column}${row}`).css("background-color", "green");


            if (occupant instanceof king) {
                if (currentHighlightedPiece.color === "white" && occupant === "black") {
                    isBlackKingChecked = true;

                } else if (currentHighlightedPiece.color === "black" && occupant === "white") {
                    isWhiteKingChecked = true;
                }
            }

            squareIsOccupied = true;
        } else if (row === -1 || row === 9) {

            squareIsOccupied = true;
        } else {
            $(`#${column}${row}`).css("background-color", "green");
        }
    }

};

function highlightedBlackBishop(event) {


    if (playerTurn === 2 && isBlackKingChecked === false) {
        resetColors();
        load(event.target);
        var currentHighlightedPiece = chessMap.get(event.target.id);

        highlightDiagTopLeftSquaresForBishop(currentHighlightedPiece);
        highlightDiagTopRightSquaresForBishop(currentHighlightedPiece);
        highlightDiagBottomLeftSquaresForBishop(currentHighlightedPiece);
        highlightDiagBottomRightSquaresForBishop(currentHighlightedPiece);

    }

};


function resetColors() {
    $(".white_square").each(function() {
        $(this).css("background-color", "#FFFFFF");
    });
    $(".black_square").each(function() {
        $(this).css("background-color", "#444444");
    });
};

function load(chessPiece) {
    cannon = chessPiece;
};