import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { every, findIndex, range, sampleSize, shuffle } from 'lodash-es';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, pluck, tap } from 'rxjs/operators';
import { Game, GameChoice, GameChoices } from 'src/app/games/games.models';
import { Announcer } from 'src/app/shared/announcer.base';
import { ANNOUNCER } from 'src/app/shared/shared.tokens';
import { StorageService } from 'src/app/shared/storage.service';

const SELECTION_ENCODE_KEY = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const QUESTION_COUNT = 12;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  game$: Observable<Game> | null = null;
  selection$: Observable<GameChoices> | null = null;
  readonly questions$ = new BehaviorSubject<GameChoices>([]);
  readonly currentQuestionIndex$ = new BehaviorSubject<number>(-1);
  readonly isComplete$ = this.currentQuestionIndex$.pipe(map(index => QUESTION_COUNT <= index));

  private name: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    @Inject(ANNOUNCER) private announcer: Announcer,
  ) {}

  ngOnInit(): void {
    this.name = this.storage.get<string>('name');

    this.game$ = this.route.data.pipe(pluck('game'));
    this.selection$ = combineLatest([this.game$, this.route.params.pipe(pluck('selection'))]).pipe(
      tap(([game, selection]) => {
        if (!selection) {
          this.redirectToSelection(game);
        }
      }),
      filter(args => every(args)),
      map(([game, selection]) => {
        return selection
          .split('')
          .map((code: string) => SELECTION_ENCODE_KEY.indexOf(code))
          .map((index: number) => game.choices[index]);
      }),
      tap(selection => {
        this.questions$.next(shuffle(selection));
        this.currentQuestionIndex$.next(-1);
      }),
    );
  }

  checkChoice(choice: GameChoice): void {
    const currentChoice = this.getCurrentQuestion();
    if (!currentChoice || this.hasFoundChoice(choice)) {
      return;
    }

    if (currentChoice.emoji === choice.emoji) {
      this.announcer.speak(`Well done, you found the ${choice.label}!`, true);
      this.moveToNextQuestion();
    } else {
      this.announcer.speak(`No, that's the ${choice.label}. Try again.`, true);
    }
  }

  hasFoundChoice(choice: GameChoice): boolean {
    const choices = this.questions$.getValue();
    const choiceIndex = findIndex(choices, { emoji: choice.emoji });
    return choiceIndex < this.currentQuestionIndex$.getValue();
  }

  start(): void {
    this.currentQuestionIndex$.next(0);
    this.readCurrentQuestion();
  }

  private readCurrentQuestion(): void {
    const question = this.getCurrentQuestion();
    const phrase = Math.random() > 0.5 ? 'can you find' : "where's";
    this.announcer.speak(`${this.name}, ${phrase} the ${question.label}?`, false);
  }

  private getCurrentQuestion() {
    const index = this.currentQuestionIndex$.getValue();
    return this.questions$.getValue()[index];
  }

  private redirectToSelection(game: Game): void {
    const selection = sampleSize(range(game.choices.length), QUESTION_COUNT);
    const selectionEncoded = selection.map(index => SELECTION_ENCODE_KEY[index]).join('');

    this.router.navigate(['/games', game.id, selectionEncoded], { replaceUrl: true });
  }

  private moveToNextQuestion(): void {
    const nextIndex = this.currentQuestionIndex$.getValue() + 1;
    this.currentQuestionIndex$.next(nextIndex);
    if (QUESTION_COUNT <= nextIndex) {
      this.announcer.speak('You have finished!', false);
    } else {
      this.readCurrentQuestion();
    }
  }
}
