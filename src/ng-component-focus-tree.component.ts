import { Component } from '@angular/core';

import ProjectTreeItemComponent2 from './project-tree-item.component-2';
import TreeComponent from './tree.component';

@Component({
	selector: 'wp-ng-component-focus-tree',
	standalone: true,
	templateUrl: './ng-component-focus-tree.component.html',
	styleUrls: ['./ng-component-focus-tree.component.scss'],
	imports: [
		TreeComponent,
		ProjectTreeItemComponent2
	]
})
export default class NgComponentFocusTreeComponent { }
