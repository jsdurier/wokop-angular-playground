import { CommonModule } from '@angular/common';
import {
	Component,
	ContentChild,
	Input,
	OnInit,
	TemplateRef
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

import ITreeDataProviderService from './i-tree-data-provider-service';
import ITreeNode from './i-tree-node';

@Component({
	selector: 'wp-tree',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		FontAwesomeModule
	],
	templateUrl: './tree.component.html',
	styleUrls: ['./tree.component.scss']
})
export default class TreeComponent<T> implements OnInit {
	@Input() node!: T;
	@Input() indent = 0;
	@Input() itemTemplateRef!: TemplateRef<any>;

	// @ContentChild('itemTemplate') itemTemplateRef!: TemplateRef<any>;

	isContentDisplayed = false;
	faArrowRight = icons.faAngleRight;
	faArrowDown = icons.faAngleDown;
	children?: T[];

	constructor(
		private readonly _treeDataProviderService: ITreeDataProviderService<T>
	) { }

	ngOnInit(): void {
		this._treeDataProviderService.change$.subscribe(() => {
			this.onChange();
		});
	}

	private async onChange(): Promise<void> {
		if (this.isContentDisplayed) {
			this.children = await this._treeDataProviderService.getChildren(this.node);
		}
	}

	async toggleOpen(): Promise<void> {
		if (!this.isContentDisplayed) {
			this.children = await this._treeDataProviderService.getChildren(this.node);
		}
		this.isContentDisplayed = !this.isContentDisplayed;
	}
}
