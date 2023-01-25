import { Injectable } from '@angular/core';

import { convertToKebabCase } from './convert-to-kebab-case';
import { getAvailableName } from './get-available-name';
import { getTypescriptFileName } from './get-typescript-file-name';
import ProjectFilesService from './project-files.service';
import ShowInputBoxService from './show-input-box.service';
import toPascalCase from './to-pascal-case';

const PLACE_HOLDER = 'Angular service name';
const PROMPT = 'Angular service name';
const FILE_SUFFIX = '.service';
const CLASS_NAME_SUFFIX = 'Service';

@Injectable({ providedIn: 'root' })
export default class CreateNgServiceInWorkspaceService {
	constructor(
		private readonly _showInputBoxService: ShowInputBoxService,
		private readonly _projectFilesService: ProjectFilesService
	) { }

	async createNgServiceInWorkspace() {
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
			kebabName + FILE_SUFFIX
		);
		const className = getClassName(kebabName);
		const fileContent = getFileContent(className);
		const filePath = getTypescriptFileName(availableNameKebab);
		this._projectFilesService.updt_create({
			path: filePath,
			content: fileContent
		});
		return {
			className,
			fileName: availableNameKebab
		};
	}
}

function getFileContent(className: string): string {
	return `import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export default class ${className} {
	constructor() {
		
	}
}
`;
}

function getClassName(kebabName: string): string {
	const name = toPascalCase(kebabName);
	return `${name}${CLASS_NAME_SUFFIX}`;
}
