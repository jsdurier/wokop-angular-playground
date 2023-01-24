import { Injectable } from '@angular/core';

import IShowInputBox from './i-show-input-box';
import ShowOverlayService from './show-overlay.service';
import VscodeInputBoxValueService from './vscode-input-box-value.service';
import VscodeInputBoxComponent from './vscode-input-box.component';
import VscodeWorkspaceViewContainerRefService from './vscode-workspace-view-container-ref.service';

@Injectable({ providedIn: 'root' })
export default class ShowInputBoxService {
	constructor(
		private readonly _showOverlayService: ShowOverlayService,
		private readonly _vscodeWorkspaceViewContainerRefService: VscodeWorkspaceViewContainerRefService,
		private readonly _vscodeInputBoxValueService: VscodeInputBoxValueService
	) { }

	async showInputBox(value: IShowInputBox): Promise<string | undefined> {
		const container = this._vscodeWorkspaceViewContainerRefService.container;
		if (container === undefined) {
			throw new Error('VscodeWorkspaceViewContainerRefService.container is undefined');
		}
		const componentRef = this._showOverlayService.showOverlay4(
			container,
			VscodeInputBoxComponent,
			{
				x: 'center',
				y: 0
			},
			{ description: value }
		);
		return new Promise(resolve => {
			this._vscodeInputBoxValueService.value$.subscribe(e => {
				componentRef.destroy();
				resolve(e);
			});
		});
	}
}
