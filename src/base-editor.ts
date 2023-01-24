import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	OnDestroy,
	Output,
	ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';

import IMonacoEditorConfig from './i-monaco-editor-config';
import IStandaloneEditorConstructionOptions2 from './i-standalone-editor-construction-options2';
import MONACO_EDITOR_CONFIG_INJECTION_TOKEN from './monaco-editor-config-injection-token';

let loadedMonaco = false;
let loadPromise: Promise<void>;

@Component({
	template: ''
})
export default abstract class BaseEditor implements AfterViewInit, OnDestroy {
	@Output() onInit = new EventEmitter<any>();
	@Output() isInit = new EventEmitter<void>();

	@ViewChild(
		'editorContainer',
		{ static: true }
	) _editorContainer!: ElementRef;

	protected _editor: any;
	protected _options!: IStandaloneEditorConstructionOptions2;
	protected _windowResizeSubscription!: Subscription;

	constructor(@Inject(MONACO_EDITOR_CONFIG_INJECTION_TOKEN) protected _config: IMonacoEditorConfig) { }

	ngAfterViewInit(): void {
		if (loadedMonaco) {
			// Wait until monaco editor is available
			loadPromise.then(() => {
				this.isInit.emit();
				this.initMonaco(this._options);
			});
		} else {
			loadedMonaco = true;
			loadPromise = new Promise<void>((resolve: any) => {
				const baseUrl = (this._config.baseUrl || './assets') + '/monaco-editor/min/vs';
				if (typeof ((<any>window).monaco) === 'object') {
					resolve();
					return;
				}
				const onGotAmdLoader: any = () => {
					// Load monaco
					(<any>window).require.config({ paths: { 'vs': `${baseUrl}` } });
					(<any>window).require([`vs/editor/editor.main`], () => {
						if (typeof this._config.onMonacoLoad === 'function') {
							this._config.onMonacoLoad();
						}
						this.isInit.emit();
						this.initMonaco(this._options);
						resolve();
					});
				};

				// Load AMD loader if necessary
				if (!(<any>window).require) {
					const loaderScript: HTMLScriptElement = document.createElement('script');
					loaderScript.type = 'text/javascript';
					loaderScript.src = `${baseUrl}/loader.js`;
					loaderScript.addEventListener('load', onGotAmdLoader);
					document.body.appendChild(loaderScript);
				} else {
					onGotAmdLoader();
				}
			});
		}
	}

	protected abstract initMonaco(options: any): void;

	ngOnDestroy() {
		if (this._windowResizeSubscription) {
			this._windowResizeSubscription.unsubscribe();
		}
		if (this._editor) {
			this._editor.dispose();
			this._editor = undefined;
		}
	}
}
