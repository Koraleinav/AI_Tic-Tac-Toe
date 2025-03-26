import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface NewGameResponse {
  id: number;
}

interface MoveResponse {
  board: (string | null)[];
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

  startNewGame(): Observable<NewGameResponse> {
    return this.http.post<NewGameResponse>(`${this.apiUrl}/new/`, {});
  }

  makeMove(gameId: number, moveIndex: number): Observable<MoveResponse> {
    return this.http.put<MoveResponse>(`${this.apiUrl}/${gameId}/move/`, { position: moveIndex });
  }
}