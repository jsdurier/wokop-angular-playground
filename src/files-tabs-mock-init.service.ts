import { Injectable } from '@angular/core';

import FilesInEditorService from './files-in-editor.service';
import ProjectFilesService from './project-files.service';
import FILE_LIST from './projects-files-mock';

@Injectable({ providedIn: 'root' })
export default class FilesTabsMockInitService {
	constructor(
		projectFilesService: ProjectFilesService,
		filesInEditorService: FilesInEditorService
	) {
		projectFilesService.filePathList = FILE_LIST;
		filesInEditorService.files = [
			{
				filePath: 'main.ts'
			},
			{
				filePath: 'app.component.ts'
			},
			{
				filePath: 'app.component.html'
			},
			{
				filePath: 'app.component.scss'
			}
		]
	}
}
