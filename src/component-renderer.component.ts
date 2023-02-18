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
	selector: 'wp-component-renderer',
	standalone: true,
	templateUrl: './component-renderer.component.html',
	styleUrls: ['./component-renderer.component.scss'],
	imports: [
		CommonModule
	]
})
export default class ComponentRendererComponent {
	dynamicComponent: any;

	private readonly _subscriptions: Unsubscribable[] = [];

	ngOnInit(): void {
		this.update();
		this._subscriptions.push(
			// this.listenChanges(),
			// this.listenFocusFileChange()
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
			/**
			 * TODO à passer en input
			 */
			ngProjectFilesService
		);
	}

	// private listenChanges(): Unsubscribable {
	// 	return this._ngProjectFilesService.change$.pipe(debounceTime(DEBOUNCE_MS)).subscribe(() => {
	// 		this.update();
	// 	});
	// }

	// private listenFocusFileChange(): Unsubscribable {
	// 	return this._focusComponentService.focusComponentChange$.subscribe(() => {
	// 		this.update();
	// 	});
	// }

	private get ngComponentFileName(): string | undefined {
		/**
		 * TODO à passer en input
		 */
		const fileName = 'tata.component'; // this._focusComponentService.focusComponent;
		if (fileName === undefined) {
			return undefined;
		}
		return fileName + '.ts';
	}
}

const FILES = {
	'tata.component.ts': `import { Component } from '@angular/core';

@Component({
	selector: 'wp-tata',
	templateUrl: './tata.component.html',
	styleUrls: ['./tata.component.scss']
})
export default class TataComponent { }
`,
	'tata.component.html': '<div>tata !!!</div>',
	'tata.component.scss': `:host > div {
	background-color: yellow;
}`
};
const ngProjectFilesService = {
	getFile(fileName: string) {
		return (FILES as any)[fileName];
	}
};
