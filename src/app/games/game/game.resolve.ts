import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Game } from 'src/app/games/games.models';
import { GamesService } from 'src/app/shared/games.service';

@Injectable()
export class GameResolve implements Resolve<Game | null> {
  constructor(private gamesService: GamesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Game | null> {
    return this.gamesService.getGame(route.params['gameId']).pipe(
      tap(game => {
        if (!game) {
          this.router.navigate(['/']);
        }
      }),
    );
  }
}
