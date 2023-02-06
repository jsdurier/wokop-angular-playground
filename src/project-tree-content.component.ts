import { Component } from '@angular/core';

import AllFilesTreeComponent from './all-files-tree.component';
import NgComponentFocusTreeComponent from './ng-component-focus-tree.component';

@Component({
	selector: 'wp-project-tree-content',
	standalone: true,
	templateUrl: './project-tree-content.component.html',
	styleUrls: ['./project-tree-content.component.scss'],
	imports: [
		AllFilesTreeComponent,
		NgComponentFocusTreeComponent
	]
})
export default class ProjectTreeContentComponent { }
