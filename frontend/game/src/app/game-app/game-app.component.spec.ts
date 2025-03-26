import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAppComponent } from './game-app.component';

describe('GameAppComponent', () => {
  let component: GameAppComponent;
  let fixture: ComponentFixture<GameAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
