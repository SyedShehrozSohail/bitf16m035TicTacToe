var  turnc=0;
var gboard;
const player1 = 'O';
const player2 = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]
var count1 = 0, count2 = 0;
const cells = document.querySelectorAll('.cell');
startGame();
var level = 0;
function startGame() {
    document.querySelector(".endgame").style.display = "none";

    gboard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
        console.log("hello");
    }
    console.log("hello");
}
var turnp="0";

function turnClick(square) {
    var e = document.getElementById("selection");
    var selectedLevel = e.options[e.selectedIndex].value;
    level = selectedLevel;

    
    console.log(level);
    if (typeof gboard[square.target.id] == 'number') {
        if(level!="3")
        {
            if (!turn(square.target.id, player1))
            { 
                if (!checkTie()) turn(bestSpot(), player2);
            }
        }
        else if (turnc<8)
        {
            if (turnp=="0")
            {
                    turn(square.target.id, player1);
                turnp="1";
            }
            else
            {
                turn(square.target.id, player2);
                turnp="0";
            }
            
        }
        else
        {
            declareWinner("Tie Game!");
            turnc=0;
        }
    }
}

function turn(squareId, player) {
    

    turnc++;
    gboard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(gboard, player)
    
    if (gameWon != null && gameWon.status == true) {
        gameOver(gameWon)
        return true;
    }
    return false;
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player, status: true };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == player1 ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    turnc=0;
    declareWinner(gameWon.player == player1 ? "O win!" : "X win!");
}

function declareWinner(who) {
    
    if (who == "X win!")
        count1++;
    else if (who == "O win!")
        count2++;
    document.getElementById("button1").value="X         "+count1;
    document.getElementById("button2").value="O         "+count2;
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return gboard.filter(s => typeof s == 'number');
}

function bestSpot() {
    if (level == 1)
        return emptySquares()[0];
    else
        return minimax(gboard, player2).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}
function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, player1)) {
        return { score: -10 };
    } else if (checkWin(newBoard, player2)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == player2) {
            var result = minimax(newBoard, player1);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, player2);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === player2) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}