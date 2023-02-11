import { Injectable } from '@angular/core';

const KEY = 'focusComponents';

/**
 * TODO-372
 * save in local storage
 */
@Injectable({ providedIn: 'root' })
export default class FocusComponentsService {
	focusComponents:	string[];

	constructor() {
		this.focusComponents = getData();
	}

	save(fileName: string): void {
		if (this.focusComponents.indexOf(fileName) >= 0) {
			return;
		}
		this.focusComponents.push(fileName);
		localStorage.setItem(
			KEY,
			JSON.stringify(this.focusComponents)
		);
	}
}

function getData(): string[] {
	const data = localStorage.getItem(KEY);
	if (data === null) {
		return [
			'example.component', // TODO
			'toolbar.component'
		];
	}
	return JSON.parse(data);
}
