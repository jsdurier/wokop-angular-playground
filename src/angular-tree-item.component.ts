import {
	Component,
	Input
} from '@angular/core';

import FilesInEditorService from './files-in-editor.service';
import { IDependencyOptions } from './i-dependency-options';
import ProjectTreeItemComponent from './project-tree-item.component';
import IData from './project-tree-item-data';

@Component({
	selector: 'wp-angular-tree-item',
	standalone: true,
	imports: [
		ProjectTreeItemComponent
	],
	templateUrl: './angular-tree-item.component.html',
	styleUrls: ['./angular-tree-item.component.scss']
})
export default class AngularTreeItemComponent {
	@Input() data!: IDependencyOptions;

	projectTreeItemData!: IData;

	constructor(private readonly _filesInEditorService: FilesInEditorService) { }

	ngOnInit(): void {
		this.projectTreeItemData = {
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
