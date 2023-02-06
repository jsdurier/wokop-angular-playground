import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

import IFileContextMenuOption from './i-file-context-menu-option';
import ContextMenuRef from './context-menu-ref.service';
import WorkspaceCommands2Service from './workspace-commands-2.service';

@Component({
	selector: 'wp-workspace-context-menu',
	standalone: true,
	templateUrl: './workspace-context-menu.component.html',
	styleUrls: ['./workspace-context-menu.component.scss'],
	imports: [
		NgFor
	]
})
export default class WorkspaceContextMenuComponent {
	options: IFileContextMenuOption[] = [];

	constructor(
		private readonly _contextMenuRef: ContextMenuRef,
		private readonly _workspaceCommandsService: WorkspaceCommands2Service
	) { }

	ngOnInit(): void {
		const commands = this._workspaceCommandsService.commands;
		this.options = Object.keys(commands).map(commandId => {
			return {
				label: commands[commandId].name,
				commandId
			};
		});
	}

	onClick(option: IFileContextMenuOption): void {
		this._contextMenuRef.close();
		this._workspaceCommandsService.runCommand(
			option.commandId
		);
	}
}
