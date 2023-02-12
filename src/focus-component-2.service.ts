import { Injectable } from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class FocusComponentService {
	focusComponent?: string;

	private readonly _focusComponentChange$ = new Subject<void>();

	set(focusComponent: string): void {
		this.focusComponent = focusComponent;
		this._focusComponentChange$.next();
	}

	get focusComponentChange$(): Observable<void> {
		return this._focusComponentChange$.asObservable();
	}
}
