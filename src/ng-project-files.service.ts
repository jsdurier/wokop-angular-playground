import { Injectable } from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';

import IFile from './i-file';
import INgProjectFilesService from './i-ng-project-files-service';

@Injectable({ providedIn: 'root' })
export default class NgProjectFilesService implements INgProjectFilesService {
	private _filePathList: IFile[] = [];
	private readonly _change$ = new Subject<void>();

	getFile(filePath: string): string | undefined {
		const res = this._filePathList.find(e => e.path === filePath)?.content;
		if (res === undefined) {
			throw new Error(`no file ${filePath}`);
		}
		return res;
	}

	set(files: IFile[]): void {
		this._filePathList = files;
		this._change$.next();
	}

	get change$(): Observable<void> {
		return this._change$.asObservable();
	}
}
