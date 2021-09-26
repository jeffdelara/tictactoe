// Player AI
const PlayerAI = (string) => {

    let mark = string;
    let projectedBoard = [];
    let moves = [];
    let win_moves = [];

    const getMark = () => {
        return mark;
    }

    const saveBoard = (board) => {
        projectedBoard = [];
        const boardCopy = [];

        for(let i = 0; i < board.length; i++) {
            const _arr = []
            for(let j = 0; j < board[0].length; j++) {
                _arr.push(board[i][j]);
            }
            boardCopy.push(_arr);
        }

        projectedBoard = boardCopy;
        
        return boardCopy;
    }

    const generateAvailableMoves = () => {
        moves = [];
        for(let i = 0; i < projectedBoard.length; i++) {
            for(let j = 0; j < projectedBoard[0].length; j++) {
                if(projectedBoard[i][j] === 0) {
                    moves.push([i, j]);
                }
            }
        }
    }

    const getAvailableMoves = () => {
        return moves;
    }

    const isInMoves = ([row, col]) => {
        for(let move of moves) {
            if(move[0] === row && move[1] === col) {
                return true;
            }
        }
        return false;
    }

    const equals3 = (a, b, c) => {
        return a === b && b === c && a !== 0;
    }

    const checkWin = (board) => {

        // vertical
        for(let i = 0; i < 3; i++) {
            if(equals3(board[0][i], board[1][i], board[2][i])) return board[0][i];
        }
        
        //horizontal 
        for(let i = 0; i < 3; i++) {
            if(equals3(board[i][0], board[i][1], board[i][2])) return board[i][0];
        }

        // diagonal left to right
        if(equals3(board[0][0], board[1][1], board[2][2])) return board[0][0];

        // diagonal right to left
        if(equals3(board[2][0], board[1][1], board[0][2])) return board[0][2];

        let occupied = 0;
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if(board[i][j] !== 0) {
                    occupied += 1;
                } 
            }
        }

        if(occupied === 9) {
            return 'tie';
        } else {
            return null;
        }
    }

    const projectMove = ([row, col], face) => {
        // copy the board
        const temp_board = [];
        for(let i = 0; i < projectedBoard.length; i++) {
            const row = [];
            for(let j = 0; j < projectedBoard[0].length; j++) {
                row.push(projectedBoard[i][j]);
            }
            temp_board.push(row);
        }
    }

    const move = ([row, col], board) => {
        saveBoard(board);
        generateAvailableMoves();
        

        if(isInMoves([row, col])) {
            // board[row][col] = mark;
            projectMove([row, col], mark);
        }
        else {
            console.log("Cant move there.");
        }
    }

    const aiMoveHard = (board) => {
        let highScore = -Infinity;
        let bestMove;
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                
                if(board[i][j] === 0) 
                {
                    board[i][j] = mark; // ai
                    let score = minmax(board, 0, false);
                    board[i][j] = 0; // clean up 

                    if(score > highScore) 
                    {
                        highScore = score;
                        bestMove = [i, j];
                    }
                }
            }
        }

        return bestMove;
    }

    const minmax = (board, depth, isMaximizing) => {
        const ai = mark;
        const enemyPlayer = (mark === "O") ? "X" : "O";
        const score = {};
        score[ai] = 10;
        score[enemyPlayer] = -10;
        score['tie'] = 0;

        // check if board has win
        const result = checkWin(board);
        if(result !== null) {
            return score[result];
        }

        if(isMaximizing) {
            let bestScore = -Infinity;

            for(let i = 0; i < board.length; i++) 
            {
                for(let j = 0; j < board[i].length; j++) 
                {
                    if(board[i][j] === 0) 
                    {
                        board[i][j] = ai; 
                        let score = minmax(board, depth + 1, false);
                        board[i][j] = 0; 
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }

            return bestScore;

        } else {
            let bestScore = Infinity;

            for(let i = 0; i < board.length; i++) 
            {
                for(let j = 0; j < board[i].length; j++) 
                {
                    if(board[i][j] === 0) 
                    {
                        board[i][j] = enemyPlayer;
                        let score = minmax(board, depth + 1, true);
                        board[i][j] = 0;
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    const aiMove = (board) => {
        win_moves = [];
        saveBoard(board);
        generateAvailableMoves();

        const enemy_face = (mark === "X") ? "O" : "X";
        
        // possible win moves
        for(let _move of moves) {
            projectMove([_move[0], _move[1]], mark);
            // console.log("Possible move: ", _move);
        }

        // console.log(win_moves);
        if(win_moves.length > 0) {
            return win_moves[0];
        }

        // possible enemy win
        win_moves = [];
        for(let _move of moves) {
            projectMove([_move[0], _move[1]], enemy_face);
            // console.log("Possible move Enemy: ", _move);
        }

        if(win_moves.length > 0) {
            return win_moves[0];
        }

        if(win_moves.length === 0) {
            return randomMove();
        }
    }

    const shuffle = (array) => {
        let currentIndex = array.length,  randomIndex;
          
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
        
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        
        return array;
    } 

    const randomMove = () => {
        
        let preferred_moves = [
            [1, 1]
        ];

        preferred_moves = shuffle(preferred_moves);

        for(let i = 0; i < preferred_moves.length; i++) {
            const pref_move = preferred_moves[i];
            for(let j = 0; j < moves.length; j++) {
                const _move = moves[j];
                if(_move[0] === pref_move[0] && _move[1] === pref_move[1]) {
                    return moves[j];            
                }
            }
        }

        const random = Math.floor(Math.random() * (moves.length - 1));
        return moves[random];
    }
    
    return {aiMove, aiMoveHard, mark, getMark};
}
// /Player AI