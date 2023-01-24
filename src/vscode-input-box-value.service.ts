import { Injectable } from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class VscodeInputBoxValueService {
	value = '';

	private _value$ = new Subject<string | undefined>();

	cancel(): void {
		this._value$.next(undefined);
	}

	validate(): void {
		this._value$.next(this.value);
	}

	get value$(): Observable<string | undefined> {
		return this._value$.asObservable();
	}
}
