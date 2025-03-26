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

  // Declare the winning lines
  private readonly lines = [
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

  ngOnInit(): void {
    this.startNewGame();
  }

  setGameMode(mode: 'playerVsPlayer' | 'playerVsComputer'): void {
    this.gameMode = mode;
    this.startNewGame();
  }

  startNewGame() : void{
    this.gameService.startNewGame().subscribe(response => {
    this.gameId = response.id;
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X'; // Player X always starts
    this.winner = null;
    this.isDraw = false;
    this.resetStats();
    this.currentPlayerStreak = null;
    });
  }

  resetStats(): void {
    this.playerXWins = 0;
    this.playerOWins = 0;
    this.winningStreakX = 0;
    this.winningStreakO = 0;
    this.currentPlayerStreak = null;
  }

  makeMove(index: number): void {
    // should prevent moves in invalid game states or on occupied cells, regardless of the game mode or current player
    if (!this.gameId || this.winner || this.isDraw || this.board[index]) {
      return;
    }

    this.gameService.makeMove(this.gameId, index).subscribe(response => {
      if (response && response.board && Array.isArray(response.board)) {
        this.board = [...response.board] as (string | null)[];
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

  bestMove(): number {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'O';
        let score = this.minimax(this.board, false); // 'false' because the human player will play next
        this.board[i] = null; // Undo the move

        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

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

  checkWinner(boardToCheck: (string | null)[]): string | null {
    for (const line of this.lines) {
      const [a, b, c] = line;
      if (boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c]) {
        return boardToCheck[a];
      }
    }
    return null;
  }

  isTie(boardToCheck: (string | null)[]): boolean {
    return boardToCheck.every(cell => cell !== null) && !this.checkWinner(boardToCheck);
  }

  computerMove(): void {
    if (!this.gameId || this.winner || this.isDraw || this.currentPlayer !== 'O') {
      return;
    }

    const move = this.bestMove();
    if (move !== -1) {
      this.makeMove(move);
    }
  }

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

  checkWin(boardToCheck: (string | null)[], player: 'X' | 'O'): boolean {
    for (const line of this.lines) {
      const [a, b, c] = line;
      if (boardToCheck[a] === player && boardToCheck[b] === player && boardToCheck[c] === player) {
        return true;
      }
    }
    return false;
  }

  checkWinningCombination(board: (string | null)[]): number[] | null {
    for (const line of this.lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return null;
  }

    getCellClass(index: number): string {
      return this.board[index] === 'X' ? 'x' : this.board[index] === 'O' ? 'o' : '';
    }
}