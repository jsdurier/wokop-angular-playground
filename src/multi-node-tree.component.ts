import { CommonModule } from '@angular/common';
import {
	Component,
	Input,
	OnDestroy,
	OnInit,
	TemplateRef
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import { Unsubscribable } from 'rxjs';

import ITreeDataProviderService from './i-tree-data-provider-service';
import TreeOpenStateService from './tree-open-state.service';
import TreeComponent from './tree.component';

@Component({
	selector: 'wp-multi-node-tree',
	standalone: true,
	templateUrl: './multi-node-tree.component.html',
	styleUrls: ['./multi-node-tree.component.scss'],
	imports: [
		CommonModule,
		FlexLayoutModule,
		FontAwesomeModule,
		TreeComponent
	]
})
export default class MultiNodeTreeComponent<T> implements OnDestroy, OnInit {
	@Input() nodes?: T[];
	@Input() indent = 0;
	@Input() itemTemplateRef!: TemplateRef<any>;

	faArrowRight = icons.faAngleRight;
	faArrowDown = icons.faAngleDown;
	rootNodes!: T[];
	children?: T[];

	private readonly _subscriptions: Unsubscribable[] = [];

	constructor(
		private readonly _treeDataProviderService: ITreeDataProviderService<T>,
    private readonly _treeOpenStateService: TreeOpenStateService<T>
	) { }

	ngOnInit(): void {
		this.fetchRootNodes();
		this._subscriptions.push(this._treeDataProviderService.change$.subscribe(() => {
			this.onChange();
		}));
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach(e => e.unsubscribe());
	}

	getOpenState(node: T) {
		return this._treeOpenStateService.getState(node);
	}

	changeIsContentDisplayedChange(value: {
		path: T[],
		isOpen: boolean
	}): void {
		this._treeOpenStateService.changeNodeState(value);
	}

	private async onChange(): Promise<void> {
		this.fetchRootNodes();
	}

	private async fetchRootNodes(): Promise<void> {
		this.rootNodes = await this.getRootNodes();
	}

	private async getRootNodes(): Promise<T[]> {
		if (this.nodes !== undefined) {
			return this.nodes;
		}
		return this._treeDataProviderService.getRootNodes();
	}
}
