import { Injectable } from '@angular/core';

import addNewImport from './add-new-import';
import CreateFunctionInWorkspaceService from './create-function-in-workspace.service';
import ProjectFilesService from './project-files.service';

@Injectable({ providedIn: 'root' })
export default class CreateFunctionInFileService {
	constructor(
		private readonly _projectFilesService: ProjectFilesService,
		private readonly _createFunctionInWorkspaceService: CreateFunctionInWorkspaceService
	) { }

	async createFunction(data: { filePath: string }): Promise<void> {
		const a = await this._createFunctionInWorkspaceService.createFunction();
		if (a === undefined) {
			return;
		}
		const {
			functionName,
			availableNameKebab
		} = a;
		const importerFilePath = data.filePath;
		const importerFileContent = this._projectFilesService.getFile(importerFilePath);
		const newFileContent = addNewImport(
			{
				alias: functionName,
				name: availableNameKebab
			},
			importerFileContent
		);
		this._projectFilesService.updt_modifyContent({
			path: importerFilePath,
			content: newFileContent
		});
	}
}
