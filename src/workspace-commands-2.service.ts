import { Injectable } from '@angular/core';

import CreateFileInWorkspaceService from './create-file-in-workspace.service';
import CreateFunctionInWorkspaceService from './create-function-in-workspace.service';
import CreateNgComponentInWorkspaceService from './create-ng-component-in-workspace.service';
import IWorkspaceCommand from './i-workspace-command';

@Injectable({ providedIn: 'root' })
export default class WorkspaceCommands2Service {
	commands: {
		[commandId: string]: IWorkspaceCommand;
	} = {};

	constructor(
		createFunctionService: CreateFunctionInWorkspaceService,
		createNgComponentService: CreateNgComponentInWorkspaceService,
		createFileInWorkspaceService: CreateFileInWorkspaceService
		// createNgServiceInFileService: CreateNgServiceInFileService
	) {
		this.commands = {
			createFunction: {
				name: 'Create function',
				handler: () => {
					createFunctionService.createFunction();
				}
			},
			createNgComponent: {
				name: 'Create ng component',
				handler: () => {
					createNgComponentService.createNgComponentInWorkspace();
				}
			},
			createFile: {
				name: 'Create file',
				handler: () => {
					createFileInWorkspaceService.createFileInWorkspace();
				}
			},
			// createNgService: {
			// 	name: 'Create ng service',
			// 	handler: () => {
			// 		console.warn('create ng service');
			// 		// createNgServiceInFileService.createNgServiceInFile(data);
			// 	}
			// }
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
