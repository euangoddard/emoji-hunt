import { Injectable } from '@angular/core';
import { Announcer } from 'src/app/shared/announcer.base';
import { debugLog } from 'src/app/shared/debug-log';
import { StorageService } from 'src/app/shared/storage.service';

@Injectable()
export class LoggingAnnouncerService extends Announcer {
  constructor(storage: StorageService) {
    super(storage);
  }

  speak(phrase: string, cancel: boolean): void {
    debugLog(this.currentVoice.voiceURI, phrase);
  }
}
