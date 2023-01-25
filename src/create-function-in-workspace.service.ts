import { Injectable } from '@angular/core';

import addNewImport from './add-new-import';
import { convertToKebabCase } from './convert-to-kebab-case';
import { getAvailableName } from './get-available-name';
import { getTypescriptFileName } from './get-typescript-file-name';
import ProjectFilesService from './project-files.service';
import ShowInputBoxService from './show-input-box.service';
import { camalize } from './to-camel-case';

@Injectable({ providedIn: 'root' })
export default class CreateFunctionInWorkspaceService {
	constructor(
		private readonly _projectFilesService: ProjectFilesService,
		private readonly _showInputBoxService: ShowInputBoxService
	) { }

	async createFunction(data: { filePath: string }): Promise<void> {
		const interfaceNameFromUser = await this._showInputBoxService.showInputBox({
			placeHolder: 'functionName',
			prompt: 'Function name'
		});
		if (interfaceNameFromUser === undefined) {
			return;
		}
		let kebabName = convertToKebabCase(interfaceNameFromUser);
		const availableNameKebab = await getAvailableName(
			this._projectFilesService.filePathList.map(e => e.path),
			kebabName
		);
		const newFilePath = getTypescriptFileName(availableNameKebab)
		const functionName = camalize(kebabName);
		this._projectFilesService.updt_create({
			path: newFilePath,
			content: `export default function ${functionName}() {
	// ...
}
`
		});
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
