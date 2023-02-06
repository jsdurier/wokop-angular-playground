import { Injectable } from '@angular/core';

import IWorkspaceCommand from './i-workspace-command';

@Injectable({ providedIn: 'root' })
export default class WorkspaceCommands2Service {
	commands: {
		[commandId: string]: IWorkspaceCommand;
	} = {};

	constructor(
		// createFunctionService: CreateFunctionInWorkspaceService,
		// createNgComponentService: CreateNgComponentInFileService,
		// createNgServiceInFileService: CreateNgServiceInFileService
	) {
		this.commands = {
			createFunction: {
				name: 'Create function',
				handler: () => {
					console.warn('create function');
					// createFunctionService.createFunction();
				}
			},
			createNgComponent: {
				name: 'Create ng component',
				handler: () => {
					console.warn('create ng component');
					// createNgComponentService.createNgComponentInFile(data);
				}
			},
			createNgService: {
				name: 'Create ng service',
				handler: () => {
					console.warn('create ng service');
					// createNgServiceInFileService.createNgServiceInFile(data);
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
