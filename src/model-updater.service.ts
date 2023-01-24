import { Injectable } from '@angular/core';

import MovableMouseService from './movable-mouse.service';
import waitDelay from './wait-delay';

const SEQUENCE = [
	{
		type: 'click',
		value: {
			id: 'toto'
		}
	},
	{
		type: 'click',
		value: {
			id: 'tata'
		}
	}
];

@Injectable({ providedIn: 'root' })
export default class ModelUpdaterService {
	private _index = 0;

	constructor(
		private readonly _movableMouseService: MovableMouseService
	) { }

	init(): void {
		this.processNextStep();
	}

	private async processNextStep(): Promise<void> {
		if (this._index >= SEQUENCE.length) {
			this._index = 0;
		}
		const step = SEQUENCE[this._index];
		if (step.type === 'click') {
			const { id } = step.value;
			/**
			 * Utiliser container
			 */
			const element = document.getElementById(id);
			if (element === null) {
				return;
			}
			await this._movableMouseService.startClick(element);
			await waitDelay(1000); // TODO
			this._index++;
			this.processNextStep();
		}
	}
}
