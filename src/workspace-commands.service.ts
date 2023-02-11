import { Injectable } from '@angular/core';

import CreateFunctionInWorkspaceService from './create-function-in-workspace.service';
import CreateNgComponentInFileService from './create-ng-component-in-file.service';
import CreateNgServiceInFileService from './create-ng-service-in-file.service';
import FocusComponentService from './focus-component.service';
import IWorkspaceCommand from './i-workspace-command';

interface IData {
	filePath: string;
}

@Injectable({ providedIn: 'root' })
export default class WorkspaceCommandsService {
	commands: {
		[commandId: string]: IWorkspaceCommand;
	} = {};

	constructor(
		createFunctionService: CreateFunctionInWorkspaceService,
		createNgComponentService: CreateNgComponentInFileService,
		createNgServiceInFileService: CreateNgServiceInFileService,
		focusComponentService: FocusComponentService
	) {
		this.commands = {
			createFunction: {
				name: 'Create function',
				handler: (data: IData) => {
					createFunctionService.createFunction(data);
				}
			},
			createNgComponent: {
				name: 'Create ng component',
				handler: (data: IData) => {
					createNgComponentService.createNgComponentInFile(data);
				}
			},
			createNgService: {
				name: 'Create ng service',
				handler: (data: IData) => {
					createNgServiceInFileService.createNgServiceInFile(data);
				}
			},
			focus: {
				name: 'Focus',
				handler: (data: IData) => {
					focusComponentService.set(data.filePath);
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
