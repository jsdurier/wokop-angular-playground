import { Component } from '@angular/core';

import ITreeDataProviderService from './i-tree-data-provider-service';
import ProjectTreeDataProviderService from './project-tree-data-provider.service';
import ProjectTreeItemComponent2 from './project-tree-item.component-2';
import TreeComponent from './tree.component';

@Component({
	selector: 'wp-project-tree',
	standalone: true,
	imports: [
		TreeComponent,
		ProjectTreeItemComponent2
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
