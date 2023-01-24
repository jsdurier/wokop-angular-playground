import { Component } from '@angular/core';

import WorkspaceWithRendererDebugComponent from './workspace-with-renderer-debug.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		WorkspaceWithRendererDebugComponent
	],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export default class AppComponent {

}
