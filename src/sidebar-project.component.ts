import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

import ClickableElementComponent from './clickable-element.component';
import ContextMenu3Directive from './context-menu-3.directive';
import NgComponentFocusTreeComponent from './ng-component-focus-tree.component';
import ProjectTreeContentComponent from './project-tree-content.component';
import ProjectTreeItemComponent2 from './project-tree-item.component-2';
import TreeViewWithTitleComponent from './tree-view-with-title.component';
import TreeComponent from './tree.component';
import WorkspaceContextMenuComponent from './workspace-context-menu.component';

const IS_CONTENT_DISPLAYED = true;

@Component({
	selector: 'wp-sidebar-project',
	standalone: true,
	templateUrl: './sidebar-project.component.html',
	styleUrls: ['./sidebar-project.component.scss'],
	imports: [
		ClickableElementComponent,
		ContextMenu3Directive,
		FontAwesomeModule,
		NgComponentFocusTreeComponent,
		NgIf,
		ProjectTreeContentComponent,
		TreeComponent,
		ProjectTreeItemComponent2,
		TreeViewWithTitleComponent
	]
})
export default class SidebarProjectComponent {
	isContentDisplayed = IS_CONTENT_DISPLAYED;
	faArrowRight = icons.faAngleRight;
	faArrowDown = icons.faAngleDown;
	WorkspaceContextMenuComponent = WorkspaceContextMenuComponent;

	toggleOpen(): void {
		this.isContentDisplayed = !this.isContentDisplayed;
	}
}
