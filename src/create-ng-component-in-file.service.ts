import { Injectable } from '@angular/core';

import CreateNgComponentInWorkspaceService from './create-ng-component-in-workspace.service';
import importNgComponentInFile from './import-ng-component-in-file';
import ProjectFilesService from './project-files.service';

@Injectable({ providedIn: 'root' })
export default class CreateNgComponentInFileService {
	constructor(
		private readonly _createNgComponentInWorkspaceService: CreateNgComponentInWorkspaceService,
		private readonly _projectFilesService: ProjectFilesService
	) { }

	async createNgComponentInFile(data: { filePath: string }): Promise<string | undefined> {
		const importerFile = this._projectFilesService.filePathList.find(e => e.path === data.filePath);
		if (importerFile === undefined) {
			return undefined;
		}
		const a = await this._createNgComponentInWorkspaceService.createNgComponentInWorkspace();
		if (a === undefined) {
			return undefined;
		}
		const newFileContent = importNgComponentInFile(
			importerFile.content,
			{
				className: a.componentClassName,
				fileName: a.fileName
			}
		);
		this._projectFilesService.updt_modifyContent({
			path: data.filePath,
			content: newFileContent
		});
		return a.fileName;
	}
}
