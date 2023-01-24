import {
	Component,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import FilesTabsComponent from './files-tabs.component';
import ProjectTreeComponent from './project-tree.component';
import ShowOverlayService from './show-overlay.service';
import VscodeWorkspaceViewContainerRefService from './vscode-workspace-view-container-ref.service';

@Component({
	selector: 'wp-vscode-workspace',
	standalone: true,
	imports: [
		ProjectTreeComponent,
		FlexLayoutModule,
		FilesTabsComponent
	],
	templateUrl: './vscode-workspace.component.html',
	styleUrls: ['./vscode-workspace.component.scss']
})
export default class VscodeWorkspaceComponent {
	@ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
	@ViewChild('hostContainer', {read: ViewContainerRef}) hostContainer!: ViewContainerRef; 

	constructor(
		private readonly _viewContainerRefService: VscodeWorkspaceViewContainerRefService,
		private readonly _showOverlayService: ShowOverlayService
	) { }

	ngAfterViewInit(): void {
		this._viewContainerRefService.container = this.container;
		this._showOverlayService.container = this.hostContainer;
	}
}
