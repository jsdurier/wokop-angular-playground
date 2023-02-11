import { Component } from '@angular/core';

import WorkspaceWithRendererComponent from './workspace-with-renderer.component';

@Component({
	selector: 'app-root',
	standalone: true,
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	imports: [
		WorkspaceWithRendererComponent
	]
})
export default class AppComponent {

}
