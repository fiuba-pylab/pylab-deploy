import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

declare const MonacoEnvironment: any;

if (typeof MonacoEnvironment !== 'undefined') {
  MonacoEnvironment.getWorkerUrl = function (moduleId: string, label: string) {
    return './assets/editor.worker.js';
  };
} else {
  console.error('MonacoEnvironment is not defined.');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


