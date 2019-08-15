import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoggingAnnouncerService } from 'src/app/shared/logging-announcer.service';
import { ANNOUNCER } from 'src/app/shared/shared.tokens';
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
    { provide: ANNOUNCER, useClass: LoggingAnnouncerService },
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
