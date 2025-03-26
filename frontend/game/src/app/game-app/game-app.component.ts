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
  currentPlayer : 'X' | 'O' = 'X';
  winner: string | null = null;
  isDraw: boolean = false;
  gameId: number | null = null;
  private gameService = inject(GameService);

  constructor(){}

  ngOnInit(): void {
    this.startNewGame();
  }
    
  startNewGame() : void{
    this.gameService.startNewGame().subscribe(response => {
    this.gameId = response.id;
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.isDraw = false;
    });
  }

  makeMove(index: number): void {
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
    });
  }

    getCellClass(index: number): string {
      return this.board[index] === 'X' ? 'x' : this.board[index] === 'O' ? 'o' : '';
    }

}

