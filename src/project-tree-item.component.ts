import { CommonModule } from '@angular/common';
import {
	Component,
	Input
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import ClickableIconComponent from './clickable-icon.component';
import IData from './project-tree-item-data';

@Component({
	selector: 'wp-project-tree-item',
	standalone: true,
	imports: [
		FlexLayoutModule,
		CommonModule,
		ClickableIconComponent
	],
	templateUrl: './project-tree-item.component.html',
	styleUrls: ['./project-tree-item.component.scss']
})
export default class ProjectTreeItemComponent {
	@Input() data!: IData;

	onClick(
		action: any,
		event: any
	): void { // TODO IAction
		action.callack();
		event.stopPropagation();
	}
}
