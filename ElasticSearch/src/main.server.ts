import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import 'zone.js/node';

// re-export the AppServerModule used by the Angular SSR build
// AppServerModule is not present in this project; remove re-export to avoid missing module error.

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
