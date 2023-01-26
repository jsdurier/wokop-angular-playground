import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import FilesInEditorService from './files-in-editor.service';
import IFileInEditor from './i-file-in-editor';
import IStandaloneEditorConstructionOptions2 from './i-standalone-editor-construction-options2';
import InitMonacoModelService from './init-monaco-model.service';
import MonacoEditor2Component from './monaco-editor-2';
import ProjectFilesService from './project-files.service';
import TabComponent from './tab.component';
import TabsComponent from './tabs.component';

const DEFAULT_THEME = 'vs-dark';
const EXTENSION_LANGUAGE_MAPPING = {
	ts: 'typescript',
	html: 'html',
	scss: 'scss'
};

@Component({
	selector: 'wp-files-tabs',
	standalone: true,
	imports: [
		TabsComponent,
		TabComponent,
		CommonModule,
		MonacoEditor2Component
	],
	templateUrl: './files-tabs.component.html',
	styleUrls: ['./files-tabs.component.scss']
})
export default class FilesTabsComponent {
	private _map: { [filePath: string]: IStandaloneEditorConstructionOptions2 } = {};

	constructor(
		private readonly _projectFilesService: ProjectFilesService,
		private readonly _filesInEditorService: FilesInEditorService,
		private readonly _initMonacoModelService: InitMonacoModelService
	) { }

	get files(): IFileInEditor[] {
		return this._filesInEditorService.files;
	}

	onClose(filePath: string): void {
		this._filesInEditorService.close(filePath);
	}

	onCodeChange(
		filePath: string,
		code: string
	): void {
		this._projectFilesService.updt_modifyContent2({
			path: filePath,
			content: code
		});
	}

	getOptions(filePath: string) {
		const res = this._map[filePath];
		if (res !== undefined) {
			return res;
		}
		this._map[filePath] = {
			theme: DEFAULT_THEME,
			language: getLanguage(filePath),
			tabSize: 2,
			model: {
				// value: this.getFileContent(filePath),
				// language: 'typescript',
				uri: filePath
			}
		}
		return this._map[filePath];
	}

	onMonacoInit(): void {
		this._initMonacoModelService.init();
	}
}

function getLanguage(filePath: string): string {
	const extension = getExtension(filePath);
	return (EXTENSION_LANGUAGE_MAPPING as any)[extension];
}

function getExtension(filePath: string): string {
	return filePath.split('.').slice(-1)[0];
}
