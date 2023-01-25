import { Injectable } from '@angular/core';

import CreateFunctionInWorkspaceService from './create-function-in-workspace.service';
import CreateNgComponentInFileService from './create-ng-component-in-file.service';
import CreateNgServiceInFileService from './create-ng-service-in-file.service';
import IWorkspaceCommand from './i-workspace-command';

@Injectable({ providedIn: 'root' })
export default class WorkspaceCommandsService {
	commands: {
		[commandId: string]: IWorkspaceCommand;
	} = {};

	constructor(
		createFunctionService: CreateFunctionInWorkspaceService,
		createNgComponentService: CreateNgComponentInFileService,
		createNgServiceInFileService: CreateNgServiceInFileService
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
			},
			createNgService: {
				name: 'Create ng service',
				handler: (data: any) => {
					createNgServiceInFileService.createNgServiceInFile(data);
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
