import { CommonModule } from '@angular/common';
import {
	Component,
	Input
} from '@angular/core';

import AngularTreeItemComponent from './angular-tree-item.component';
import FilesInEditorService from './files-in-editor.service';
import { IDependencyOptions } from './i-dependency-options';
import ProjectTreeItemComponent from './project-tree-item.component';
import IData from './project-tree-item-data';
import ContextMenu2Directive from './context-menu-2.directive';

@Component({
	selector: 'wp-project-tree-item-2',
	standalone: true,
	imports: [
		ProjectTreeItemComponent,
		AngularTreeItemComponent,
		CommonModule,
		ContextMenu2Directive
	],
	templateUrl: './project-tree-item.component-2.html',
	styleUrls: ['./project-tree-item.component-2.scss']
})
export default class ProjectTreeItemComponent2 {
	@Input() data!: IDependencyOptions;

	projectTreeItemData!: IData;

	constructor(
		private readonly _filesInEditorService: FilesInEditorService
	) { }

	ngOnInit(): void {
		this.projectTreeItemData = this.getData();
	}

	onClick(): void {
		this._filesInEditorService.open(this.filePath);
	}

	get filePath(): string {
		return `${this.data.fileName}.${this.data.extension}`;
	}

	private getData(): IData {
		if (this.data.type !== 'angular') {
			return {
				label: this.data.alias
			};
		}
		return {
			label: this.data.alias,
			actions: [
				{
					icon: 'css',
					callack: () => {
						const filePath = `${this.data.fileName}.scss`;
						this._filesInEditorService.open(filePath);
					}
				},
				{
					icon: 'html',
					callack: () => {
						const filePath = `${this.data.fileName}.html`;
						this._filesInEditorService.open(filePath);
					}
				}
			]
		};
	}
}
