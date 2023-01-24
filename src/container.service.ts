import {
	ElementRef,
	Injectable
} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class ContainerService {
	container?: ElementRef;
	isInit$ = new Subject<void>();

	// private _container$ = new Subject<void>();

	init(container: ElementRef): void {
		this.container = container;
		this.isInit$.next();
		// this._container$.next();
	}

	async waitIsInit(): Promise<void> {
		return new Promise(resolve => {
			this.isInit$.subscribe(() => {
				resolve();
			});
		});
	}

	// async getContainerAsync(): Promise<ElementRef> {
	// 	if (this.container !== undefined) {
	// 		return this.container;
	// 	}
	// 	return new Promise(resolve => {
	// 		const subscription = this._container$.subscribe(() => {
	// 			subscription.unsubscribe();
	// 			resolve(this.container!);
	// 		});
	// 	});
	// }
}
