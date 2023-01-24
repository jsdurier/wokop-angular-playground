import { Component } from '@angular/core';

import CompileComponentComponent from './compile-component.component';
import INgProjectFilesService from './i-ng-project-files-service';
import NgProjectFilesDebugService from './ng-project-files-debug.service';

@Component({
	selector: 'wp-compile-debug',
	standalone: true,
	templateUrl: './compile-debug.component.html',
	styleUrls: ['./compile-debug.component.scss'],
	imports: [
		CompileComponentComponent
	],
	providers: [
		{
			provide: INgProjectFilesService,
			useClass: NgProjectFilesDebugService
		}
	]
})
export default class CompileDebugComponent {
	ngComponentFileName = 'toto.component.ts';
}
