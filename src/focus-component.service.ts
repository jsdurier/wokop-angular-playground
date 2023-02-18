import { Injectable } from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';

import FocusComponentsService from './focus-components.service';

const KEY = 'focusComponent';

@Injectable({ providedIn: 'root' })
export default class FocusComponentService {
	/**
	 * file name without extension
	 */
	focusComponent: string;

	private readonly _focusComponentChange$ = new Subject<void>();

	constructor(
		private readonly _focusComponentsService: FocusComponentsService
	) {
		this.focusComponent = getData();
	}

	set(filePath: string): void {
		const fileName = getFileNameWithoutExtension(filePath);
		if (this.focusComponent === fileName) {
			return;
		}
		this.focusComponent = fileName;
		localStorage.setItem(
			KEY,
			this.focusComponent
		);
		this._focusComponentsService.save(fileName);
		this._focusComponentChange$.next();
	}

	get focusComponentChange$(): Observable<void> {
		return this._focusComponentChange$.asObservable();
	}
}

function getData(): string {
	const data = localStorage.getItem(KEY);
	if (data === null) {
		return 'example.component'; // TODO
	}
	return data;
}

function getFileNameWithoutExtension(value: string): string {
	const a = value.split('.');
	a.pop();
	return a.join('.');
}
