import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
	convertTypescriptDep,
	getDepsOfTypescriptFile
} from './get-deps-of-ts-file';
import { IDependencyOptions } from './i-dependency-options';
import ITreeDataProviderService from './i-tree-data-provider-service';
import ProjectFilesService from './project-files.service';

const ALIAS = 'all files';

@Injectable({ providedIn: 'root' })
export default class AllFilesTreeDataProviderService implements ITreeDataProviderService<IDependencyOptions> {
	constructor(
		private readonly _projectFilesService: ProjectFilesService
	) { }

	async getRootNode(): Promise<IDependencyOptions> {
		return {
			alias: ALIAS,
			type: ALIAS,
			isCollapsed: true
		};
	}

	async getChildren(node: IDependencyOptions): Promise<IDependencyOptions[]> {
		if (node.alias === ALIAS) {
			const a = await this.getAllFiles();
			console.log('getChildren', a);
			return a;
		}
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

	private async getAllFiles(): Promise<IDependencyOptions[]> {
		const filePathList = this._projectFilesService.filePathList;
		return (Promise.all(filePathList.map(e => {
			const a = e.path.split('.');
			const extension = a.pop();
			if (extension === 'html' || extension === 'scss') {
				return undefined;
			}
			const fileName = a.join('.');
			return convertTypescriptDep(
				fileName,
				fileName,
				async e => this.readFile(e)
			);
		}).filter(e => e !== undefined)) as Promise<IDependencyOptions[]>);
	}
}
