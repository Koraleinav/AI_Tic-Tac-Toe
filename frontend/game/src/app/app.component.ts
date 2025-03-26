import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameService } from './game.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GameAppComponent } from './game-app/game-app.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, GameAppComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [GameService]
})
export class AppComponent {
  title = 'Tic-Tac-Toe';

}
