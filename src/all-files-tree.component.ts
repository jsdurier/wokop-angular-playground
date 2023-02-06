import { Component } from '@angular/core';

import AllFilesTreeDataProviderService from './all-files-tree-data-provider.service';
import ITreeDataProviderService from './i-tree-data-provider-service';
import ProjectTreeItemComponent2 from './project-tree-item.component-2';
import TreeComponent from './tree.component';

@Component({
	selector: 'wp-all-files-tree',
	standalone: true,
	templateUrl: './all-files-tree.component.html',
	styleUrls: ['./all-files-tree.component.scss'],
	imports: [
		TreeComponent,
		ProjectTreeItemComponent2
	],
	providers: [
		{
			provide: ITreeDataProviderService,
			useClass: AllFilesTreeDataProviderService
		}
	]
})
export default class AllFilesTreeComponent { }
