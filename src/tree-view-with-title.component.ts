import { NgIf } from '@angular/common';
import {
	Component,
	Input
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

import ClickableElementComponent from './clickable-element-2';
import ContextMenu3Directive from './context-menu-3.directive';
import MultiNodeTreeComponent from './multi-node-tree.component';
import ProjectTreeItemComponent2 from './project-tree-item.component-2';
import TreeComponent from './tree.component';

const IS_CONTENT_DISPLAYED = true;

@Component({
	selector: 'wp-tree-view-with-title',
	standalone: true,
	templateUrl: './tree-view-with-title.component.html',
	styleUrls: ['./tree-view-with-title.component.scss'],
	imports: [
		ClickableElementComponent,
		ContextMenu3Directive,
		FontAwesomeModule,
    MultiNodeTreeComponent,
		NgIf,
		ProjectTreeItemComponent2,
		TreeComponent
	]
})
export default class TreeViewWithTitleComponent {
	@Input() title!: string;

	isContentDisplayed = IS_CONTENT_DISPLAYED;
	faArrowRight = icons.faAngleRight;
	faArrowDown = icons.faAngleDown;
	// TODO-4532
	// WorkspaceContextMenuComponent = WorkspaceContextMenuComponent;

	toggleOpen(): void {
		this.isContentDisplayed = !this.isContentDisplayed;
	}
}
