import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	TemplateRef
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

import ITreeDataProviderService from './i-tree-data-provider-service';

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
	@Input() openState?: T[][];

	@Output() isContentDisplayedChange = new EventEmitter<{
		path: T[];
		isOpen: boolean;
	}>();

	faArrowRight = icons.faAngleRight;
	faArrowDown = icons.faAngleDown;
	children?: T[];

	constructor(
		private readonly _treeDataProviderService: ITreeDataProviderService<T>
	) { }

	ngOnInit(): void {
		this.onChange();
	}

	get isContentDisplayed(): boolean {
		return this.openState !== undefined && this.openState.some(e => e.length === 1);
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
		this.isContentDisplayedChange.next({
			path: [this.node],
			isOpen: !this.isContentDisplayed
		});
	}

	changeChildContentDisplayed(value: {
		path: T[],
		isOpen: boolean
	}): void {
		this.isContentDisplayedChange.next({
			path: [
				this.node,
				...value.path
			],
			isOpen: value.isOpen
		});
	}

	getOpenState(node: T) {
		if (this.openState === undefined) {
			return undefined;
		}
		const list = this.openState.map(e => e.slice(1)).filter(e => e.length !== 0 && isDataEqual(
			e[0],
			node
		));
		return list.length > 0 ? list : undefined;
	}
}

function isDataEqual(
	x: any,
	y: any
): boolean {
	return JSON.stringify(x) === JSON.stringify(y);
}
