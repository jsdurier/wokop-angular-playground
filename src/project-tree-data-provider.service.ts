import { Injectable } from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';

import {
	convertTypescriptDep,
	getDepsOfTypescriptFile
} from './get-deps-of-ts-file';
import { IDependencyOptions } from './i-dependency-options';
import ITreeDataProviderService from './i-tree-data-provider-service';
import ProjectFilesService from './project-files.service';

@Injectable({ providedIn: 'root' })
export default class ProjectTreeDataProviderService implements ITreeDataProviderService<IDependencyOptions> {
	constructor(
		private readonly _projectFilesService: ProjectFilesService
	) { }

	async getRootNode(): Promise<IDependencyOptions> {
		/**
		 * TODO
		 */
		const res = this._projectFilesService.filePathList[0];
		const fileName = getFileName(res.path);
		return convertTypescriptDep(
			fileName,
			res.path,
			async e => this.readFile(e)
		);
		// const res = this._projectFilesService.filePathList.find(e => e.path === 'main.ts');
		// if (res === undefined) {
		// 	throw new Error('no file main.ts found');
		// }
		// return convertTypescriptDep(
		// 	'main',
		// 	'main',
		// 	async e => this.readFile(e)
		// );
	}

	async getChildren(node: IDependencyOptions): Promise<IDependencyOptions[]> {
		return getDepsOfTypescriptFile(
			node,
			async e => this.readFile(e)
		);
	}

	get change$(): Observable<void> {
		return this._projectFilesService.change$;
	}

	private async readFile(filePath: string): Promise<string> {
		return this._projectFilesService.getFile(filePath);
	}
}

function getFileName(filePath: string): string {
	const a = filePath.split('.');
	a.pop();
	return a.join('.');
}
