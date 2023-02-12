import { Routes } from '@angular/router';

import FullScreenRendererComponent from './full-screen-renderer.component';
import WorkspaceWithRendererComponent from './workspace-with-renderer.component';

const ROUTES: Routes = [
	{
		path: '',
		component: WorkspaceWithRendererComponent
	},
	{
		path: 'renderer',
		component: FullScreenRendererComponent
	}
];
export default ROUTES;
