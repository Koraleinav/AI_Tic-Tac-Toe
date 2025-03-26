import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface GameResponse {
  id: number;
  board: (string | null);
  current_player: 'X' | 'O';
  winner: string | null;
  is_draw: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:8000/api/game'; 

  constructor(private http: HttpClient) { }

  startNewGame(): Observable<GameResponse> {
    return this.http.post<GameResponse>(`${this.apiUrl}/new/`, {});
  }

  makeMove(gameId: number, position: number): Observable<GameResponse> {
    return this.http.put<GameResponse>(`${this.apiUrl}/${gameId}/move/`, { position });
  }

  getGameState(gameId: number): Observable<GameResponse> {
    return this.http.get<GameResponse>(`${this.apiUrl}/${gameId}/`);
  }
}