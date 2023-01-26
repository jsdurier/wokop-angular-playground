import { Component } from '@angular/core';

import { ANGULAR_CORE_FILE } from './angular-core-file';
import ANGULAR_PLATFORM_BROWSER_FILE from './angular-platform-browser-file';
import CompileComponentComponent from './compile-component.component';
import deepClone from './deep-clone';
import FilesInEditorService from './files-in-editor.service';
import IFileInEditor from './i-file-in-editor';
import INgProjectFilesService from './i-ng-project-files-service';
import ProjectFilesService from './project-files.service';
import VscodeWorkspaceComponent from './vscode-workspace.component';

@Component({
	selector: 'wp-workspace-with-renderer-debug',
	standalone: true,
	templateUrl: './workspace-with-renderer-debug.component.html',
	styleUrls: ['./workspace-with-renderer-debug.component.scss'],
	imports: [
		VscodeWorkspaceComponent,
		CompileComponentComponent
	],
	providers: [
		{
			provide: INgProjectFilesService,
			useExisting: ProjectFilesService
		}
	]
})
export default class WorkspaceWithRendererDebugComponent {
	ngComponentFileName = 'example.component.ts';

	constructor(
		projectFilesService: ProjectFilesService,
		filesInEditorService: FilesInEditorService
	) {
		// projectFilesService.filePathList = deepClone(FILE_LIST);
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
		filesInEditorService.files = deepClone(FILES_IN_EDITOR);
	}
}

// const FILE_LIST: IFile[] = [
// 	/**
// 	 * TODO
// 	 * TataComponent est considéré comme un import du
// 	 * fichier courant.
// 	 */
// 	{
// 		path: 'toto.component.ts',
// 		content: `import { Component } from '@angular/core';

// import TataComponent from './tata.component';

// @Component({
// 	selector: 'toto',
// 	standalone: true,
// 	templateUrl: './toto.component.html',
// 	styleUrls: ['./toto.component.scss'],
// 	imports: [
// 		TataComponent
// 	]
// })
// export default class TotoComponent {

// }
// `
// 	},
// 	{
// 		path: 'toto.component.html',
// 		content: '<p>I am toto component !!</p> <tata></tata>'
// 	},
// 	{
// 		path: 'toto.component.scss',
// 		content: 'p {color: orange;}'
// 	},
// 	{
// 		path: 'tata.component.ts',
// 		content: `import { Component } from '@angular/core';

// @Component({
// 	selector: 'tata',
// 	standalone: true,
// 	templateUrl: './tata.component.html',
// 	styleUrls: ['./tata.component.scss']
// })
// export default class TataComponent {

// }`
// 	},
// 	{
// 		path: 'tata.component.html',
// 		content: '<p>I am tata component !!</p>'
// 	},
// 	{
// 		path: 'tata.component.scss',
// 		content: 'p {color: blue;}'
// 	}
// ];

const FILES_IN_EDITOR: IFileInEditor[] = [
	{
		filePath: 'example.component.ts',
		selected: true
	}
];
