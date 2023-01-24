import { Injectable } from '@angular/core';

import { ANGULAR_CORE_FILE } from './angular-core-file';
import ANGULAR_PLATFORM_BROWSER_FILE from './angular-platform-browser-file';
import FilesInEditorService from './files-in-editor.service';
import IFileInEditor from './i-file-in-editor';
import ProjectFilesService from './project-files.service';
import FILE_LIST from './projects-files-mock';

const FILES_IN_EDITOR: IFileInEditor[] = [
	{
		filePath: 'main.ts',
		selected: true
	},
	{
		filePath: 'app.component.ts',
		selected: false
	},
	// {
	// 	filePath: 'app.component.html'
	// },
	// {
	// 	filePath: 'app.component.scss'
	// }
];

@Injectable({ providedIn: 'root' })
export default class VscodeWorkspaceMockInitService {
	constructor(
		projectFilesService: ProjectFilesService,
		filesInEditorService: FilesInEditorService
	) {
		projectFilesService.filePathList = FILE_LIST;
		projectFilesService.nodeModules = [
			{
				path: 'node_modules/@angular/core/index.d.ts',
				content: ANGULAR_CORE_FILE
			},
			{
				path: 'node_modules/@angular/platform-browser/index.d.ts',
				content: ANGULAR_PLATFORM_BROWSER_FILE
			}
		]
		filesInEditorService.files = FILES_IN_EDITOR;
	}
}
