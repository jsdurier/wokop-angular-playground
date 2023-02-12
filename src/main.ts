import '@angular/compiler';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
	PreloadAllModules,
	provideRouter,
	withPreloading
} from '@angular/router';

import AppComponent from './app.component';
import ROUTES from './app-routing.module';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(
	AppComponent,
	{
		providers: [
			provideRouter(
				ROUTES,
				withPreloading(PreloadAllModules)
			)
		]
	}
);
