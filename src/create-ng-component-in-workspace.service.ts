import { Injectable } from '@angular/core';

import { convertToKebabCase } from './convert-to-kebab-case';
import { getAvailableName } from './get-available-name';
import { getTypescriptFileName } from './get-typescript-file-name';
import ProjectFilesService from './project-files.service';
import ShowInputBoxService from './show-input-box.service';
import toPascalCase from './to-pascal-case';

const PLACE_HOLDER = 'Angular component name';
const PROMPT = 'Angular component name';
const COMPONENT_FILE_SUFFIX = '.component';
const COMPONENT_CLASS_NAME_SUFFIX = 'Component';
const PREFIX = 'wp';

@Injectable({ providedIn: 'root' })
export default class CreateNgComponentInWorkspaceService {
	constructor(
		private readonly _showInputBoxService: ShowInputBoxService,
		private readonly _projectFilesService: ProjectFilesService
	) { }

	async createNgComponentInWorkspace() {
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
			kebabName + COMPONENT_FILE_SUFFIX
		);
		const htmlFileName = `${availableNameKebab}.html`;
		const styleFileName = `${availableNameKebab}.scss`;
		const componentClassName = getComponentClassName(kebabName);
		const fileContent = getNgComponentFileContent(
			componentClassName,
			kebabName,
			htmlFileName,
			styleFileName
		);
		const componentFilePath = getTypescriptFileName(availableNameKebab);
		this._projectFilesService.updt_create({
			path: componentFilePath,
			content: fileContent
		});
		this._projectFilesService.updt_create({
			path: htmlFileName,
			content: getHtmlFileContent(kebabName)
		});
		this._projectFilesService.updt_create({
			path: styleFileName,
			content: ''
		});
		// await createMockInputsFile(
		// 	srcPath,
		// 	fileName
		// );
		// await createMockInitService(componentFilePath);
		// vscode.window.showTextDocument(vscode.Uri.file(componentFilePath));
		return {
			componentClassName,
			fileName: availableNameKebab
		};
	}
}

/**
 * @param kebabName suffix .component
 */
function getNgComponentFileContent(
	componentClassName: string,
	kebabName: string,
	htmlFileName: string,
	styleFileName: string
): string {
	return `import { Component } from '@angular/core';

@Component({
	selector: '${PREFIX}-${kebabName}',
	standalone: true,
	templateUrl: './${htmlFileName}',
	styleUrls: ['./${styleFileName}']
})
export default class ${componentClassName} { }
`;
}

function getComponentClassName(kebabName: string): string {
	const componentName = toPascalCase(kebabName);
	return `${componentName}${COMPONENT_CLASS_NAME_SUFFIX}`;
}

function getHtmlFileContent(kebabName: string): string {
	return `<p>${kebabName} component works</p>`;
}

// async function importComponentInFile(
// 	importFileName: string,
// 	srcPath: string,
// 	componentClassName: string,
// 	fileName: string
// ): Promise<void> {
// 	await importInFile(
// 		importFileName,
// 		srcPath,
// 		componentClassName,
// 		fileName
// 	);
// 	/**
// 	 * TODO-3 ajouter le componsant importé dans le tableau imports
// 	 * du @Component.
// 	 */
// }
