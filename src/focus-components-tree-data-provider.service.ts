import { Injectable } from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';

import FocusComponentService from './focus-component.service';
import FocusComponentsService from './focus-components.service';
import {
	convertTypescriptDep,
	getDepsOfTypescriptFile
} from './get-deps-of-ts-file';
import { IDependencyOptions } from './i-dependency-options';
import ITreeDataProviderService from './i-tree-data-provider-service';
import ProjectFilesService from './project-files.service';

@Injectable({ providedIn: 'root' })
export default class FocusComponentsTreeDataProviderService implements ITreeDataProviderService<IDependencyOptions> {
	constructor(
		private readonly _focusComponentService: FocusComponentService,
		private readonly _focusComponentsService: FocusComponentsService,
		private readonly _projectFilesService: ProjectFilesService
	) { }

	async getRootNodes(): Promise<IDependencyOptions[]> {
		const files = this._focusComponentsService.focusComponents;
		return Promise.all(files.map(e => convertTypescriptDep(
			e,
			e + '.ts',
			async e => this.readFile(e)
		)));
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
