import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, shareReplay } from 'rxjs/operators';
import { Game, Games } from 'src/app/games/games.models';

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor(private http: HttpClient) {}

  getGame(id: string): Observable<Game | null> {
    return this.getGames().pipe(map(games => games.find(g => g.id === id) || null));
  }

  getGames(): Observable<Games> {
    return this.http.get<{ games: Games }>('/assets/games.json').pipe(
      pluck('games'),
      shareReplay(1),
    );
  }
}
