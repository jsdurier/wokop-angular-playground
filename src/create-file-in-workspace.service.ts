import { Injectable } from '@angular/core';

import { convertToKebabCase } from './convert-to-kebab-case';
import { getAvailableName } from './get-available-name';
import { getTypescriptFileName } from './get-typescript-file-name';
import ProjectFilesService from './project-files.service';
import ShowInputBoxService from './show-input-box.service';

const PLACE_HOLDER = 'file name';
const PROMPT = 'file name';

@Injectable({ providedIn: 'root' })
export default class CreateFileInWorkspaceService {
	constructor(
		private readonly _showInputBoxService: ShowInputBoxService,
		private readonly _projectFilesService: ProjectFilesService
	) { }

	async createFileInWorkspace() {
		const nameFromUser = await this._showInputBoxService.showInputBox({
			placeHolder: PLACE_HOLDER,
			prompt: PROMPT
		});
		if (nameFromUser === undefined) {
			return undefined;
		}
		const kebabName = convertToKebabCase(nameFromUser);
		const availableNameKebab = await getAvailableName(
			this._projectFilesService.filePathList.map(e => e.path),
			kebabName
		);
		const filePath = getTypescriptFileName(availableNameKebab);
		const fileContent = '';
		this._projectFilesService.updt_create({
			path: filePath,
			content: fileContent
		});
		return availableNameKebab;
	}
}
