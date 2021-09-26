// tic tac toe
console.log("READY");

const GAME = {
    PLAYING: 0,
    OVER: 1
}

let state = GAME.PLAYING;
let board = [
    ['X', 'O', 'X'],
    ['X', 'X', 'X'],
    ['X', 'O', 'X']
]
let moves = [];
let player_ai = [false, true];
let playerAI = PlayerAI("O");
let ai_difficulty = 'hard'; // easy / hard
let player = ["X", "O"];
let currentPlayer = player[0];
let turn = 0;
let win = null; // winning coordinates

let nav = document.querySelector("#navigation");
let message = document.querySelector("#message");
let gameBoard = document.querySelector("#game");

document.querySelector("#player").innerHTML = currentPlayer;
setClickEvent();
document.querySelector("#play").addEventListener('click', clickPlayHandler);

function hideModal() 
{
    const modal = document.querySelector('.modal'); 
    modal.classList.toggle('hide');
    // modal.classList.remove('show');
    document.querySelector('.modal-bg').classList.toggle('hide');
}

function showModal() 
{
    const modal = document.querySelector('.modal');
    modal.classList.toggle('hide');
    // modal.classList.remove('hide');
    document.querySelector('.modal-bg').classList.toggle('hide');
}

function setDifficulty(diff) 
{
    if(diff === 'easy') ai_difficulty = 'easy';
    else if(diff === 'hard') ai_difficulty = 'hard';
    else ai_difficulty = 'hard';
    hideModal();
    const diff_link = document.getElementById("difficulty");
    diff_link.innerHTML = `Difficulty: ${ai_difficulty.toUpperCase()}`;
    
    init();
}

function setClickEvent()
{
    gameBoard.addEventListener('click', clickHandler);
}

function removeClickEvent() 
{
    gameBoard.removeEventListener('click', clickHandler);
}

function changePlayer() 
{
    currentPlayer = player[turn % 2];
    document.querySelector("#player").innerHTML = currentPlayer;
}

function endGame()
{
    message.classList.add('green');
    message.innerHTML = `Nice! <span id="player">${currentPlayer}</span> WINS! <i class='bx bx-wink-smile' ></i>`;
    showHistoryButton();
}

function endGameInDraw()
{
    message.classList.add('green');
    message.innerHTML = `DRAW!`;
    showHistoryButton();
    removeClickEvent();
}

function showWinningCoordinates(arr) 
{
    if(arr) 
    {
        arr.forEach(element => {
            let cell = document.querySelector(`#r${element[0]}c${element[1]}`);
            cell.classList.add('win'); 
        });
    }
}

function showHistoryButton() {
    
    nav.style.display = "block";

    let prev = document.querySelector("#prev");
    let next = document.querySelector("#next");

    prev.addEventListener("click", prevClickHandler);
    next.addEventListener("click", nextClickHandler);
}

function clickPlayHandler(event)
{
    nav.style.display = "none";
    init();
}

function prevClickHandler(event) 
{
    if(moves.length >= turn && turn-1 >= 0) 
    {
        board = moves[turn - 1];
        turn--;
    }

    else
    {
        console.log("No more moves.");
    }
    // console.log("PREV", turn, moves.length - 1);
    renderBoard();
}

function nextClickHandler(event) 
{
    
    if(turn <= moves.length && turn+1 !== moves.length) 
    {
        board = moves[turn + 1];
        turn++;
    }
    else
    {
        console.log("No more moves.");
    }
    // console.log("NEXT", turn, moves.length - 1);
    renderBoard();
    
    if(turn+1 === moves.length)
    {
        showWinningCoordinates(win);
    }
}

function checkWinCondition(row, col) 
{
    row = parseInt(row);
    col = parseInt(col);
    let win = false;
    let winning_coordinates = [];
    
    // vertical
    if(board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        winning_coordinates = [ [0, col], [1, col], [2, col]];
        return winning_coordinates;
    }
    
    //horizontal 
    if(board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        winning_coordinates = [ [row,0], [row, 1], [row, 2] ];
        return winning_coordinates;
    };

    // diagonal left to right
    if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && row === col) {
        winning_coordinates = [ [0, 0], [1, 1], [2, 2] ];
        return winning_coordinates;
    };

    // diagonal right to left
    if(board[0][2] === board[1][1] && board[1][1] === board[2][0] && row + col === 2) {
        winning_coordinates = [ [0, 2], [1, 1], [2, 0] ];
        return winning_coordinates;
    };

    return false;
}

function saveMove()
{
    // 2d arrays are referenced.
    // you will need to copy one by one
    // to make it immutable

    // empty new move array
    const new_move = [];
    for (let row_index = 0; row_index < board.length; row_index++) {
        const row = board[row_index];
        // create new empty row
        const new_row = [];

        for (let col_index = 0; col_index < row.length; col_index++) {
            const element = row[col_index];
            
            // push elements into new row
            new_row.push(element);
            
        }

        // push the completed row into new move array
        new_move.push(new_row);
    }

    // copy complete, push into moves
    moves.push(new_move)
}

function player_ai_move() {
    removeClickEvent();

    turn++;

    setTimeout(function(){
        if(ai_difficulty === 'easy') {
            [row, col] = playerAI.aiMove(board);
        } 

        if(ai_difficulty === 'hard') {
            [row, col] = playerAI.aiMoveHard(board);
        }
        
        board[row][col] = playerAI.getMark();

        saveMove();
        renderBoard();

        // winning condition check
        win = checkWinCondition(row, col);
        if(win) 
        {
            // console.log(win);
            state = GAME.OVER;
            showWinningCoordinates(win);
            endGame();
        } else {

            // is this a draw?
            if(turn === 9) 
            {
                console.log("DRAW");
                endGameInDraw();
            }
            else
            {
                // continue the game
                setClickEvent();
                changePlayer();
            }
        }
    }, 800);    
}

// click handler
function clickHandler(event) 
{
    // update board array
    let row = event.target.dataset.row;
    let col = event.target.dataset.col;

    // check if a piece is already present
    // return nothing if so
    if(board[row][col]) return 0;

    switch (state) {
        case GAME.PLAYING:
            turn++;

            board[row][col] = currentPlayer;
            
            saveMove();
            renderBoard();

            // winning condition check
            win = checkWinCondition(row, col);
            if(win) 
            {
                // console.log(win);
                state = GAME.OVER;
                showWinningCoordinates(win);
                endGame();
            } else {

                // is this a draw?
                if(turn === 9) 
                {
                    console.log("DRAW");
                    endGameInDraw();
                }
                else
                {
                    // continue the game
                    changePlayer();
                    player_ai_move();
                }
            }

            
            // console.log(board);
            break;

        case GAME.OVER:
            endGame();
            break
    
        default:
            break;
    }
}


// renders the board
function renderBoard() 
{
    // clear game board
    gameBoard.innerHTML = "";
    // Looping through the board
    let div = "";

    for (let row_index = 0; row_index < board.length; row_index++) {
        const row = board[row_index];
        for (let col_index = 0; col_index < row.length; col_index++) {
            const element = row[col_index];

            div = document.createElement('div');
            div.classList.add('box');
            div.setAttribute('data-row', row_index);
            div.setAttribute('data-col', col_index);
            div.setAttribute('id', `r${row_index}c${col_index}`);

            switch (element) {
                case "X": 
                    // console.log("X");
                    div.innerHTML = "X";
                    break;

                case "O":
                    // console.log("O");
                    div.innerHTML = "O";
                    break;
                default:
                    // console.log("Empty");
                    div.innerHTML = "";
                    break;
            }
            gameBoard.appendChild(div);   
        }
    }

    if(moves.length - 1 === turn) 
    {
        next.disabled = true;
    }

    if(moves.length - 1 > turn) 
    {
        next.disabled = false;
    }

    if(turn === 0) 
    {
        prev.disabled = true;
    }

    if(turn > 0) 
    {
        prev.disabled = false;
    }
}

function init() 
{
    // restart to default
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    moves = [
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]
    ];

    turn = 0;
    state = GAME.PLAYING;
    currentPlayer = player[0];
    message.innerHTML = `<span id="player">${currentPlayer}</span>`;
    setClickEvent();
    renderBoard();
}

// console.log("GAME.INIT");
init();
const diff_link = document.getElementById("difficulty");
diff_link.innerHTML = `Difficulty: ${ai_difficulty.toUpperCase()}`;
