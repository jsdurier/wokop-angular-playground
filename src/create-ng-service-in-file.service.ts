import { Injectable } from '@angular/core';

import CreateNgServiceInWorkspaceService from './create-ng-service-in-workspace.service';
import importNgServiceInFile from './import-ng-service-in-file';
import ProjectFilesService from './project-files.service';

@Injectable({ providedIn: 'root' })
export default class CreateNgServiceInFileService {
	constructor(
		private readonly _createNgServiceInWorkspaceService: CreateNgServiceInWorkspaceService,
		private readonly _projectFilesService: ProjectFilesService
	) { }

	async createNgServiceInFile(data: { filePath: string }): Promise<string | undefined> {
		const importerFile = this._projectFilesService.filePathList.find(e => e.path === data.filePath);
		if (importerFile === undefined) {
			return undefined;
		}
		const a = await this._createNgServiceInWorkspaceService.createNgServiceInWorkspace();
		if (a === undefined) {
			return undefined;
		}
		const newFileContent = importNgServiceInFile(
			importerFile.content,
			a
		);
		this._projectFilesService.updt_modifyContent({
			path: data.filePath,
			content: newFileContent
		});
		return a.fileName;
	}
}
