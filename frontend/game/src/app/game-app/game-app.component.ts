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

  computerMove(): void {
    if (!this.gameId || this.winner || this.isDraw || this.currentPlayer !== 'O') {
      return;
    }

    let bestMove: number | null = null;

    // 1. Check if computer can win
    bestMove = this.findWinningMove('O');
    if (bestMove !== null) {
      this.makeMove(bestMove);
      return;
    }

    // 2. Check if player can win and block
    bestMove = this.findWinningMove('X');
    if (bestMove !== null) {
      this.makeMove(bestMove);
      return;
    }

    // 3. Take the center if it's free
    if (this.board[4] === null) {
      this.makeMove(4);
      return;
    }

    // 4. Take a corner if it's free
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
      if (this.board[corner] === null) {
      this.makeMove(corner);
        return;
      }
    }

    // 5. Take any other free cell
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === null) {
      this.makeMove(i);
        return;
      }
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