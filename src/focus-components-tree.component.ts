import { Component } from '@angular/core';

import FocusComponentsTreeDataProviderService from './focus-components-tree-data-provider.service';
import ITreeDataProviderService from './i-tree-data-provider-service';
import TreeViewWithTitleComponent from './tree-view-with-title.component';

@Component({
	selector: 'wp-focus-components-tree',
	standalone: true,
	templateUrl: './focus-components-tree.component.html',
	styleUrls: ['./focus-components-tree.component.scss'],
	imports: [
		TreeViewWithTitleComponent
	],
	providers: [
		{
			provide: ITreeDataProviderService,
			useClass: FocusComponentsTreeDataProviderService
		}
	]
})
export default class FocusComponentsTreeComponent {
	constructor() { }
}
