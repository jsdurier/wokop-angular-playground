import { Injectable } from '@angular/core';

import CreateNgServiceInWorkspaceService from './create-ng-service-in-workspace.service';
import importInFile from './import-in-file';
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
		/**
		 * TODO-3 ajouter le service dans le constructeur
		 * du composant ou service.
		 */
		const newFileContent = importInFile(
			importerFile.content,
			a.className,
			a.fileName
		);
		this._projectFilesService.updt_modifyContent({
			path: data.filePath,
			content: newFileContent
		});
		return a.fileName;
	}
}
