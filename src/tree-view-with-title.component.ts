import { NgIf } from '@angular/common';
import {
	Component,
	Input
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

import ClickableElementComponent from './clickable-element-2';
import ContextMenu3Directive from './context-menu-3.directive';
import WorkspaceContextMenuComponent from './workspace-context-menu.component';

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
		NgIf,
	]
})
export default class TreeViewWithTitleComponent {
	@Input() title!: string;

	isContentDisplayed = IS_CONTENT_DISPLAYED;
	faArrowRight = icons.faAngleRight;
	faArrowDown = icons.faAngleDown;
	WorkspaceContextMenuComponent = WorkspaceContextMenuComponent;

	toggleOpen(): void {
		this.isContentDisplayed = !this.isContentDisplayed;
	}
}
