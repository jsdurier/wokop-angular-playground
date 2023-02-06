import { Component } from '@angular/core';

import ITreeDataProviderService from './i-tree-data-provider-service';
import NgComponentFocusTreeComponent from './ng-component-focus-tree.component';
import ProjectTreeDataProviderService from './project-tree-data-provider.service';
import ProjectTreeItemComponent2 from './project-tree-item.component-2';
import TreeViewWithTitleComponent from './tree-view-with-title.component';
import TreeComponent from './tree.component';

@Component({
	selector: 'wp-project-tree',
	standalone: true,
	imports: [
		NgComponentFocusTreeComponent,
		TreeComponent,
		ProjectTreeItemComponent2,
		TreeViewWithTitleComponent
	],
	templateUrl: './project-tree.component.html',
	styleUrls: ['./project-tree.component.scss'],
	providers: [
		{
			provide: ITreeDataProviderService,
			useClass: ProjectTreeDataProviderService
		}
	]
})
export default class ProjectTreeComponent { }
