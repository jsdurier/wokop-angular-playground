import { CommonModule } from '@angular/common';
import {
	Component,
	Input
} from '@angular/core';

import IFileContextMenuOption from './i-file-context-menu-option';
import ContextMenuRef from './context-menu-ref.service';
import WorkspaceCommandsService from './workspace-commands.service';

@Component({
	selector: 'wp-file-context-menu',
	standalone: true,
	imports: [
		CommonModule
	],
	templateUrl: './file-context-menu.component.html',
	styleUrls: ['./file-context-menu.component.scss']
})
export default class FileContextMenuComponent {
	// @Input() options!: IFileContextMenuOption[];
	@Input() filePath!: string;

	options: IFileContextMenuOption[] = [];

	constructor(
		private readonly _contextMenuRef: ContextMenuRef,
		private readonly _workspaceCommandsService: WorkspaceCommandsService
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
			option.commandId,
			{ filePath: this.filePath }
		);
	}
}

function getFileName(filePath: string): string {
	const a = filePath.split('.');
	a.pop();
	return a.join('.');
}
