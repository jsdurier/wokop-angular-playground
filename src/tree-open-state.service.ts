import { Injectable } from '@angular/core';

@Injectable()
export default class TreeOpenStateService<T> {
	private _state: T[][] = [];

	getState(node: T) {
		const res = this._state.filter(e => {
			return isDataEqual(
				e[0],
				node
			);
		});
		return res.length === 0 ? undefined : res;
	}

	changeNodeState(value: {
		path: T[],
		isOpen: boolean
	}): void {
		if (value.isOpen) {
			this._state.push(value.path);
			return;
		}
		this._state = this._state.filter(e => !isDataEqual(
			value.path,
			e
		));
	}
}

function isDataEqual(
	x: any,
	y: any
): boolean {
	return JSON.stringify(x) === JSON.stringify(y);
}
