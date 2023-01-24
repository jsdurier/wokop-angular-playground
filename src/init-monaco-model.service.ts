import { Injectable } from '@angular/core';
import { Unsubscribable } from 'rxjs';

import ProjectFilesService from './project-files.service';

declare var monaco: any;

/**
 * TODO-102 préfixer les uri par un identifiant unique.
 */
@Injectable({ providedIn: 'root' })
export default class InitMonacoModelService {
	private _isInit = false;
	private _subscriptions: Unsubscribable[] = [];

	constructor(
		private readonly _projectFilesService: ProjectFilesService
	) { }

	init(): void {
		if (this._isInit) {
			return;
		}
		this._isInit = true;
		/**
		 * TODO-102 ne pas supprimer les models des
		 * autres workspaces.
		 */
		monaco.editor.getModels().forEach((e: any) => {
			e.dispose();
		});
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			experimentalDecorators: true,
			emitDecoratorMetadata: true
		});
		this._projectFilesService.nodeModules.forEach(e => {
			monaco.editor.createModel(
				e.content,
				undefined,
				monaco.Uri.parse(e.path)
			);
		});
		this._projectFilesService.filePathList.forEach(e => {
			const extension = getExtension(e.path);
			if (extension === 'ts') {
				monaco.editor.createModel(
					e.content,
					'typescript',
					monaco.Uri.parse(e.path)
				);
			} else {
				monaco.editor.createModel(
					e.content,
					undefined,
					// 'typescript',
					monaco.Uri.parse(e.path)
				);
			}
		});
		this.update();
	}

	private update(): void {
		this._subscriptions.push(this._projectFilesService.fileUpdated$.subscribe(filePath => {
			// const extension = getExtension(filePath);
			// if (extension !== 'ts') {
			// 	return;
			// }
			// const uri = monaco.Uri.parse(filePath);
			// const fileContent = this._projectFilesService.getFile(filePath);
			// const model = monaco.editor.getModel(uri);
			// if (model === null) {
			// 	monaco.editor.createModel(
			// 		fileContent,
			// 		undefined,
			// 		// 'typescript',
			// 		uri
			// 	);
			// 	return;
			// }
			// console.log('model set value');
			// model.setValue(fileContent);
			/**
			 * TODO
			 */
			// console.warn('should update model monaco ?');
		}));
		this._subscriptions.push(this._projectFilesService.fileCreated$.subscribe(filePath => {
			const extension = getExtension(filePath);
			if (extension !== 'ts') {
				return;
			}
			const uri = monaco.Uri.parse(filePath);
			const fileContent = this._projectFilesService.getFile(filePath);
			monaco.editor.createModel(
				fileContent,
				'typescript',
				uri
			);
		}));
	}
}

function getExtension(filePath: string): string | undefined {
	const array = filePath.split('.');
	if (array.length < 2) {
		return undefined;
	}
	return array.slice(-1)[0];
}
