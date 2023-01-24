import ShowInputBoxService from './show-input-box.service';
import { Injectable } from '@angular/core';

import addNewImport from './add-new-import';
import { convertToKebabCase } from './convert-to-kebab-case';
import { getAvailableName } from './get-available-name';
import { getTypescriptFileName } from './get-typescript-file-name';
import ProjectFilesService from './project-files.service';
import { camalize } from './to-camel-case';

@Injectable({ providedIn: 'root' })
export default class CreateFunctionInWorkspaceService {
	constructor(
		private readonly _projectFilesService: ProjectFilesService,
		private readonly _showInputBoxService: ShowInputBoxService
	) { }

	async createFunction(data: { fileName: string }): Promise<void> {
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
		const importerFilePath = getTypescriptFileName(data.fileName);
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
