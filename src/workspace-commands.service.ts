import { Injectable } from '@angular/core';

import CreateFunctionInWorkspaceService from './create-function-in-workspace.service';
import CreateNgComponentInFileService from './create-ng-component-in-file.service';
import IWorkspaceCommand from './i-workspace-command';

@Injectable({ providedIn: 'root' })
export default class WorkspaceCommandsService {
	commands: {
		[commandId: string]: IWorkspaceCommand;
	} = {};

	constructor(
		createFunctionService: CreateFunctionInWorkspaceService,
		createNgComponentService: CreateNgComponentInFileService
	) {
		this.commands = {
			createFunction: {
				name: 'Create function',
				handler: (data: any) => {
					createFunctionService.createFunction(data);
				}
			},
			createNgComponent: {
				name: 'Create ng component',
				handler: (data: any) => {
					createNgComponentService.createNgComponentInFile(data);
				}
			}
		};
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
