import { startsWith } from 'lodash-es';
import { fromEvent } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { StorageService } from 'src/app/shared/storage.service';

export abstract class Announcer {
  protected static storageKey = 'voice';
  readonly voices$ = fromEvent(speechSynthesis, 'voiceschanged').pipe(
    map(() => speechSynthesis.getVoices()),
    startWith(speechSynthesis.getVoices()),
    shareReplay(1),
  );

  readonly voice$ = this.voices$.pipe(
    map(voices => {
      const storedVoiceURI = this.storage.get<string>(Announcer.storageKey);
      if (storedVoiceURI) {
        this.currentVoice = voices.find(v => v.voiceURI === storedVoiceURI) as SpeechSynthesisVoice;
        if (!this.currentVoice) {
          this.currentVoice = voices.find(getDefaultVoice) as SpeechSynthesisVoice;
        }
      } else {
        this.currentVoice = voices.find(getDefaultVoice) as SpeechSynthesisVoice;
      }
    }),
  );

  protected currentVoice: SpeechSynthesisVoice;

  protected constructor(private storage: StorageService) {
    const voices = this.getVoices();
    const storedVoiceURI = this.storage.get<string>(Announcer.storageKey);
    if (storedVoiceURI) {
      this.currentVoice = voices.find(v => v.voiceURI === storedVoiceURI) as SpeechSynthesisVoice;
      if (!this.currentVoice) {
        this.currentVoice = voices.find(getDefaultVoice) as SpeechSynthesisVoice;
      }
    } else {
      this.currentVoice = voices.find(getDefaultVoice) as SpeechSynthesisVoice;
    }
  }

  abstract speak(phrase: string): void;

  getVoices(): readonly SpeechSynthesisVoice[] {
    return speechSynthesis.getVoices();
  }

  setVoice(voice: SpeechSynthesisVoice) {
    this.currentVoice = voice;
    this.storage.set(Announcer.storageKey, voice.voiceURI);
  }

  getVoice(): SpeechSynthesisVoice {
    return this.currentVoice;
  }
}

function getDefaultVoice(voice: SpeechSynthesisVoice): boolean {
  return voice.default;
}
