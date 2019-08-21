import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ANNOUNCER } from 'src/app/shared/shared.tokens';
import { SpeechSynthesisService } from 'src/app/shared/speech-synthesis.service';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: ANNOUNCER, useClass: SpeechSynthesisService },
    {
      provide: APP_INITIALIZER,
      useFactory: () => ensureVoices,
      multi: true,
    },
  ],
})
export class AppModule {}

function ensureVoices() {
  return new Promise(resolve => {
    if (speechSynthesis.getVoices().length) {
      resolve();
    } else {
      speechSynthesis.onvoiceschanged = () => {
        resolve();
        speechSynthesis.onvoiceschanged = null;
      };
    }
  });
}
