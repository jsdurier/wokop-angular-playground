import { Component } from '@angular/core';

import AllFilesTreeDataProviderService from './all-files-tree-data-provider.service';
import ITreeDataProviderService from './i-tree-data-provider-service';
import TreeViewWithTitleComponent from './tree-view-with-title.component';

@Component({
	selector: 'wp-all-files-tree',
	standalone: true,
	templateUrl: './all-files-tree-2.component.html',
	styleUrls: ['./all-files-tree-2.component.scss'],
	imports: [
		TreeViewWithTitleComponent
	],
	providers: [
		{
			provide: ITreeDataProviderService,
			useClass: AllFilesTreeDataProviderService
		}
	]
})
export default class AllFilesTreeComponent { }
