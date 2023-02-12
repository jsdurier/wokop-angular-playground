import { CommonModule } from '@angular/common';
import {
	Component,
	Injectable
} from '@angular/core';
import {
	debounceTime,
	Unsubscribable
} from 'rxjs';

import createNgComponentFromString from './create-ng-component-from-string';
import FocusComponentService from './focus-component.service';
import INgProjectFilesService from './i-ng-project-files-service';

const DEBOUNCE_MS = 250;

/**
 * To use this component, you should have this line
 * in main.ts file :
 * import '@angular/compiler';
 */
@Component({
	selector: 'wp-compile-component',
	standalone: true,
	templateUrl: './compile-component.component.html',
	styleUrls: ['./compile-component.component.scss'],
	imports: [
		CommonModule
	]
})
@Injectable()
export default class CompileComponentComponent {
	dynamicComponent: any;

	private readonly _subscriptions: Unsubscribable[] = [];

	constructor(
		private readonly _focusComponentService: FocusComponentService,
		private readonly _ngProjectFilesService: INgProjectFilesService
	) { }

	ngOnInit(): void {
		this.update();
		this._subscriptions.push(
			this.listenChanges(),
			this.listenFocusFileChange()
		);
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach(e => e.unsubscribe());
	}

	get renderComponent(): boolean {
		return this.dynamicComponent !== undefined;
	}

	private update(): void {
		if (this.ngComponentFileName === undefined) {
			return;
		}
		this.dynamicComponent = createNgComponentFromString(
			this.ngComponentFileName,
			this._ngProjectFilesService
		);
	}

	private listenChanges(): Unsubscribable {
		return this._ngProjectFilesService.change$.pipe(debounceTime(DEBOUNCE_MS)).subscribe(() => {
			this.update();
		});
	}

	private listenFocusFileChange(): Unsubscribable {
		return this._focusComponentService.focusComponentChange$.subscribe(() => {
			this.update();
		});
	}

	private get ngComponentFileName(): string | undefined {
		const fileName = this._focusComponentService.focusComponent;
		if (fileName === undefined) {
			return undefined;
		}
		return fileName + '.ts';
	}
}
