import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { GamesService } from 'src/app/shared/games.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [GamesService],
})
export class SharedModule {}
