import { Injectable } from '@angular/core';

import CreateFunctionInWorkspaceService from './create-function-in-workspace.service';
import IWorkspaceCommand from './i-workspace-command';

@Injectable({ providedIn: 'root' })
export default class WorkspaceCommandsService {
	commands: {
		[commandId: string]: IWorkspaceCommand;
	} = {};

	constructor(
		private readonly _createFunction: CreateFunctionInWorkspaceService
	) {
		this.commands['createFunction'] = {
			name: 'Create function',
			handler: (data: any) => {
				this._createFunction.createFunction(data);
			}
		}
	}

	runCommand(
		commandId: string,
		arg?: any
	): void {
		const command = this.commands[commandId];
		if (command === undefined) {
			return;
		}
		command.handler(arg);
	}
}
