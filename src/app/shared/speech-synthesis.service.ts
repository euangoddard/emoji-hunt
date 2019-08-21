import { Injectable } from '@angular/core';
import { Announcer } from 'src/app/shared/announcer.base';
import { StorageService } from 'src/app/shared/storage.service';

@Injectable()
export class SpeechSynthesisService extends Announcer {

  constructor(storage: StorageService) {
    super(storage);
  }

  speak(phrase: string): void {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.voice = this.currentVoice;
    speechSynthesis.speak(utterance);
  }
}
