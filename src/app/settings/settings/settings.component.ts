import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Games } from 'src/app/games/games.models';
import { Announcer } from 'src/app/shared/announcer.base';
import { GamesService } from 'src/app/shared/games.service';
import { ANNOUNCER } from 'src/app/shared/shared.tokens';
import { StorageService } from 'src/app/shared/storage.service';

@Component({
  selector: 'bb-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly voices: readonly SpeechSynthesisVoice[];
  readonly form: FormGroup;

  readonly gamesChoices$: Observable<GameChoices> = this.gamesService.getGames().pipe(
    filter(v => !!v),
    map(games => this.summarizeGames(games)),
  );

  selectedVoice: SpeechSynthesisVoice;

  constructor(
    @Inject(ANNOUNCER) private announcer: Announcer,
    formBuilder: FormBuilder,
    private storage: StorageService,
    private gamesService: GamesService,
  ) {
    this.voices = this.announcer.getVoices();
    this.selectedVoice = this.announcer.getVoice();
    this.form = formBuilder.group({
      voice: [this.selectedVoice, Validators.required],
      name: [this.storage.get<string>('name'), Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        untilDestroyed(this),
        filter(v => !!v),
      )
      .subscribe(({ voice, name }) => {
        this.selectedVoice = voice;
        this.announcer.setVoice(voice);
        this.storage.set<string>('name', name);
      });
  }

  ngOnDestroy(): void {}

  testVoice(): void {
    this.announcer.speak('This is what the voice sounds like', true);
  }

  private summarizeGames(games: Games): GameChoices {
    return games.map(game => {
      return {
        id: game.id,
        name: game.name,
        emoji: game.choices[0].emoji,
      };
    });
  }
}

interface GameChoice {
  id: string;
  name: string;
  emoji: string;
}

type GameChoices = readonly GameChoice[];
