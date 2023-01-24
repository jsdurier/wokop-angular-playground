import { Injectable } from '@angular/core';
import {
	debounceTime,
	Observable,
	Subject,
	Unsubscribable
} from 'rxjs';

import deepClone from './deep-clone';
import IFile from './i-file';

const DELAY_MS = 2000;
const KEY = 'projectFiles';

@Injectable({ providedIn: 'root' })
export default class ProjectFilesService {
	private _change$ = new Subject<void>();
	private _fileUpdated$ = new Subject<string>();
	private _fileCreated$ = new Subject<string>();
	private _subscriptions: Unsubscribable[] = [];

	filePathList: IFile[] = [];
	nodeModules: IFile[] = [];

	constructor() {
		this.filePathList = getData();
		this.saveInLocalStorageSubscribe();
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach(e => e.unsubscribe());
	}

	getFile(filePath: string): string {
		const res = this.filePathList.find(e => e.path === filePath)?.content;
		if (res === undefined) {
			throw new Error();
		}
		return res;
	}

	updt_create(file: IFile): void {
		this.filePathList.push(file);
		this._change$.next();
		this._fileCreated$.next(file.path);
	}

	updt_modifyContent(file: IFile): void {
		const element = this.filePathList.find(e => e.path === file.path);
		if (element === undefined) {
			return;
		}
		element.content = file.content;
		this._change$.next();
		this._fileUpdated$.next(file.path);
	}

	private saveInLocalStorageSubscribe(): void {
		this._subscriptions.push(this._change$.pipe(debounceTime(DELAY_MS)).subscribe(() => {
			localStorage.setItem(
				KEY,
				JSON.stringify(this.filePathList)
			);
		}));
	}

	get change$(): Observable<void> {
		return this._change$.asObservable();
	}

	get fileUpdated$(): Observable<string> {
		return this._fileUpdated$.asObservable();
	}

	get fileCreated$(): Observable<string> {
		return this._fileCreated$.asObservable();
	}
}

function getData(): IFile[] {
	const data = localStorage.getItem(KEY);
	if (data === null) {
		return deepClone(FILE_LIST);
	}
	return JSON.parse(data);
}

const FILE_LIST: IFile[] = [
	/**
	 * TODO
	 * TataComponent est considéré comme un import du
	 * fichier courant.
	 */
	{
		path: 'toto.component.ts',
		content: `import { Component } from '@angular/core';

import TataComponent from './tata.component';

@Component({
	selector: 'toto',
	standalone: true,
	templateUrl: './toto.component.html',
	styleUrls: ['./toto.component.scss'],
	imports: [
		TataComponent
	]
})
export default class TotoComponent {

}
`
	},
	{
		path: 'toto.component.html',
		content: '<p>I am toto component !!</p> <tata></tata>'
	},
	{
		path: 'toto.component.scss',
		content: 'p {color: orange;}'
	},
	{
		path: 'tata.component.ts',
		content: `import { Component } from '@angular/core';

@Component({
	selector: 'tata',
	standalone: true,
	templateUrl: './tata.component.html',
	styleUrls: ['./tata.component.scss']
})
export default class TataComponent {

}`
	},
	{
		path: 'tata.component.html',
		content: '<p>I am tata component !!</p>'
	},
	{
		path: 'tata.component.scss',
		content: 'p {color: blue;}'
	}
];
