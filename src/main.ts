import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

(window as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    return './assets/editor.worker.js';
  }
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
