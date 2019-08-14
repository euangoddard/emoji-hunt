import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameResolve } from 'src/app/games/game/game.resolve';
import { SharedModule } from 'src/app/shared/shared.module';
import { GameComponent } from './game/game.component';

const ROUTES: Routes = [
  {
    path: ':gameId',
    component: GameComponent,
    resolve: { game: GameResolve },
  },
  {
    path: ':gameId/:selection',
    component: GameComponent,
    resolve: { game: GameResolve },
  },
];

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES), SharedModule],
  providers: [GameResolve],
})
export class GamesModule {}
