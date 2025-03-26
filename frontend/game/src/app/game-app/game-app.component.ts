import { Component, OnInit, inject } from '@angular/core';
import { GameService } from '../game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-app.component.html',
  styleUrl: './game-app.component.css'
})
export class GameAppComponent implements OnInit {
  board: (string | null)[] = Array(9).fill(null);
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;
  isDraw: boolean = false;
  gameId: number | null = null;
  winningCombination: number[] | null = null;

  playerXWins: number = 0;
  playerOWins: number = 0;
  winningStreakX: number = 0;
  winningStreakO: number = 0;
  currentPlayerStreak: 'X' | 'O' | null = null;

  gameMode: 'playerVsPlayer' | 'playerVsComputer' = 'playerVsPlayer'; // Default mode

  private gameService = inject(GameService);


  private readonly Winninglines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  constructor(){}


  /**
   * Input: None. Output: void.
   * Initializes the component and starts a new game.
   */
  ngOnInit(): void {
    this.startNewGame();
  }


  /**
   * Input: 'playerVsPlayer' | 'playerVsComputer'. Output: void.
   * Sets the game mode and starts a new game.
   */
  setGameMode(mode: 'playerVsPlayer' | 'playerVsComputer'): void {
    this.gameMode = mode;
    this.startNewGame();
  }

  /**
   * Input: None. Output: void.
   * Starts a new game by calling the game service and resetting the board state.
   */
  startNewGame() : void{
    this.gameService.startNewGame().subscribe(response => {
    this.gameId = response.id;
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X'; // Player X always starts.
    this.winner = null;
    this.isDraw = false;
    this.resetStats();
    this.currentPlayerStreak = null;
    // Remove any previous animation classes
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('animate'));
    });
  }


  /**
   * Input: None. Output: void.
   * Resets the win counts and streaks for both players.
   */
  resetStats(): void {
    this.playerXWins = 0;
    this.playerOWins = 0;
    this.winningStreakX = 0;
    this.winningStreakO = 0;
    this.currentPlayerStreak = null;
  }


  /**
   * Input: number (index of the cell). Output: void.
   * Handles a player's move by calling the game service to update the game state.
   */
  makeMove(index: number): void {
    // Should prevent moves in invalid game states or on occupied cells, regardless of the game mode or current player.
    if (!this.gameId || this.winner || this.isDraw || this.board[index]) {
      return;
    }

    this.gameService.makeMove(this.gameId, index).subscribe(response => {
      if (response && response.board && Array.isArray(response.board)) {
        this.board = [...response.board] as (string | null)[];
        // Add animation class with a slight delay
        setTimeout(() => {
          const cellElement = document.querySelector(`.board button:nth-child(${index + 1})`) as HTMLElement;
          if (cellElement) {
            cellElement.classList.add('animate');
          }
        }, 0);
      } else {
        console.error("Invalid board data received from the backend:", response);
      }
      this.currentPlayer = response.current_player;
      this.winner = response.winner;
      this.isDraw = response.is_draw;

      this.updateWinningStreak();

      if (this.gameMode === 'playerVsComputer' && !this.winner && !this.isDraw && this.currentPlayer === 'O') {
        setTimeout(() => {
          this.computerMove();
        }, 500);
      }
    });
  }


  /**
   * Input: None. Output: void.
   * Updates the winning streak counters based on the current winner.
   */
  updateWinningStreak(): void {
    if (this.winner === 'X') {
      this.playerXWins++;
      if (this.currentPlayerStreak === 'X') {
        this.winningStreakX++;
      } else {
        this.winningStreakX = 1;
        this.winningStreakO = 0;
        this.currentPlayerStreak = 'X';
      }
    } else if (this.winner === 'O') {
      this.playerOWins++;
      if (this.currentPlayerStreak === 'O') {
        this.winningStreakO++;
      } else {
        this.winningStreakO = 1;
        this.winningStreakX = 0;
        this.currentPlayerStreak = 'O';
      }
    } else if (this.isDraw) {
      this.resetStats();
      this.currentPlayerStreak = null; // Also reset on a draw for consistency
    }
  }


  /**
   * Input: None. Output: number (index of the best move).
   * Determines the best move for the computer ('O') using the Minimax algorithm.
   *
   * This function implements the core logic of the Minimax algorithm to find the optimal move for the computer.
   * It iterates through all empty cells on the board, simulates placing an 'O' in each, and then calls the `minimax`
   * function to evaluate the resulting board state. The `minimax` function recursively explores all possible game
   * states and returns a score representing the outcome from the computer's perspective (+10 for a win, -10 for a loss,
   * 0 for a draw). `bestMove()` keeps track of the move that yields the highest score and returns the index of that move.
   */
  bestMove(): number {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'O';
        let score = this.minimax(this.board, true);
        this.board[i] = null; // Undo the move

        if (score >= bestScore) { // Changed > to >= to pick the last one in case of a tie
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }


  /**
   * Input: (string | null)[] (current board state), boolean (is it the maximizing player's turn?). Output: number (score of the board state).
   * Recursively evaluates the score of the board state using the Minimax algorithm.
   */
  minimax(board: (string | null)[], isMaximizing: boolean): number {
    const winner = this.checkWinner(board);
    if (winner === 'O') {
      return 10;
    }
    if (winner === 'X') {
      return -10;
    }
    if (this.isTie(board)) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          let score = this.minimax(board, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          let score = this.minimax(board, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }


  /**
   * Input: (string | null)[] (board to check). Output: string | null ('X', 'O', or null if no winner).
   * Checks if there is a winner on the given board.
   */
  checkWinner(boardToCheck: (string | null)[]): string | null {
    for (const line of this.Winninglines) {
      const [a, b, c] = line;
      if (boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]) {
        return boardToCheck[a];
      }
    }
    return null;
  }


  /**
   * Input: (string | null)[] (board to check). Output: boolean (true if it's a tie, false otherwise).
   * Checks if the game on the given board is a tie (all cells filled and no winner).
   */
  isTie(boardToCheck: (string | null)[]): boolean {
    return boardToCheck.every(cell => cell !== null) && !this.checkWinner(boardToCheck);
  }


  /**
   * Input: None. Output: void.
   * Determines the computer's move and calls makeMove to update the game state.
   */
  computerMove(): void {
    if (!this.gameId || this.winner || this.isDraw || this.currentPlayer !== 'O') {
      return;
    }

    const blockingMove = this.findWinningMove('X'); // Make sure X won't win in the next round
    if (blockingMove !== null) {
      this.makeMove(blockingMove);
      return;
    }

    const move = this.bestMove();
    if (move !== -1) {
      this.gameService.makeMove(this.gameId, move).subscribe(response => {
        if (response && response.board && Array.isArray(response.board)) {
          this.board = [...response.board] as (string | null)[];
          // Add animation class with a slight delay
          setTimeout(() => {
            const cellElement = document.querySelector(`.board button:nth-child(${move + 1})`) as HTMLElement;
            if (cellElement) {
              cellElement.classList.add('animate');
            }
          }, 0);
        } else {
          console.error("Invalid board data received from the backend:", response);
        }
        this.currentPlayer = response.current_player;
        this.winner = response.winner;
        this.isDraw = response.is_draw;

        this.updateWinningStreak();
      });
    }
  }


  /**
   * Input: 'X' | 'O' (player to check for). Output: number | null (index of the winning move or null).
   * Checks if the given player has a winning move available on the current board.
   */
  findWinningMove(player: 'X' | 'O'): number | null {
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === null) {
        const tempBoard = [...this.board];
        tempBoard[i] = player;
        if (this.checkWin(tempBoard, player)) {
          return i;
        }
      }
    }
    return null;
  }


  /**
   * Input: (string | null)[] (board to check), 'X' | 'O' (player). Output: boolean (true if the player wins, false otherwise).
   * Checks if the given player has won on the given board.
   */
  checkWin(boardToCheck: (string | null)[], player: 'X' | 'O'): boolean {
    for (const line of this.Winninglines) {
      const [a, b, c] = line;
      if (boardToCheck[a] === player && boardToCheck[b] === player && boardToCheck[c] === player) {
        return true;
      }
    }
    return false;
  }


  /**
   * Input: (string | null)[] (board to check). Output: number[] | null (the winning combination or null).
   * Checks if there is a winning combination on the board and returns it.
   */
  checkWinningCombination(board: (string | null)[]): number[] | null {
    for (const line of this.Winninglines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return null;
  }


    /**
   * Input: number (index of the cell). Output: string (class name 'x', 'o', or '').
   * Returns the CSS class for the cell based on its value.
   */
    getCellClass(index: number): string {
      return this.board[index] === 'X' ? 'x' : this.board[index] === 'O' ? 'o' : '';
    }
}