import { Component } from '@angular/core';

import CompileComponentComponent from './compile-component.component';
import FocusComponent2Service from './focus-component-2.service';
import FocusComponentService from './focus-component.service';
import INgProjectFilesService from './i-ng-project-files-service';
import NgProjectFilesService from './ng-project-files.service';

@Component({
	selector: 'wp-full-screen-renderer',
	standalone: true,
	templateUrl: './full-screen-renderer.component.html',
	styleUrls: ['./full-screen-renderer.component.scss'],
	providers: [
		{
			provide: FocusComponentService,
			useExisting: FocusComponent2Service
		},
		{
			provide: INgProjectFilesService,
			useExisting: NgProjectFilesService
		}
	],
	imports: [
		CompileComponentComponent
	]
})
export default class FullScreenRendererComponent {
	constructor(
		private readonly _focusComponentService: FocusComponent2Service,
		private readonly _ngProjectFilesService: NgProjectFilesService
	) {
		window.addEventListener(
			'message',
			(event) => {
				const data = event.data;
				this._ngProjectFilesService.set(data.files);
				this._focusComponentService.set(data.focusComponent);
				// event.source.postMessage('Got it!', event.origin);
			},
			false
		);
	}
}
