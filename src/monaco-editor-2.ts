import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	forwardRef,
	Inject,
	Input,
	NgZone,
	Output
} from '@angular/core';
import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR
} from '@angular/forms';
import { fromEvent } from 'rxjs';
import * as monacoTypes from 'monaco-editor';

import BaseEditor from './base-editor';
import IMonacoEditorConfig from './i-monaco-editor-config';
import IStandaloneEditorConstructionOptions2 from './i-standalone-editor-construction-options2';
import MONACO_EDITOR_CONFIG_INJECTION_TOKEN from './monaco-editor-config-injection-token';

declare var monaco: any;

@Component({
	selector: 'wp-monaco-editor-2',
	standalone: true,
	templateUrl: './monaco-editor-2.html',
	styleUrls: ['./monaco-editor-2.scss'],
	imports: [
		CommonModule
	],
	providers: [
		{
			provide: MONACO_EDITOR_CONFIG_INJECTION_TOKEN,
			useValue: {}
		},
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MonacoEditor2Component),
			multi: true
		}
	]
})
export default class MonacoEditor2Component extends BaseEditor implements ControlValueAccessor {
	propagateChange = (_: any) => { };
	onTouched = () => { };

	private _value = '';

	@Input('options')
	set options(value: IStandaloneEditorConstructionOptions2) {
		this._options = Object.assign(
			{},
			this._config.defaultOptions,
			value
		);
		if (this._editor) {
			this._editor.dispose();
			this.initMonaco(value);
		}
	}

	@Output() codeChange = new EventEmitter<string>();

	get options(): any {
		return this._options;
	}

	// @Input('model')
	// set model(model: IEditorModel) {
	// 	this._options.model = model;
	// 	if (this._editor) {
	// 		this._editor.dispose();
	// 		this.initMonaco(this._options);
	// 	}
	// }

	constructor(
		private zone: NgZone,
		@Inject(MONACO_EDITOR_CONFIG_INJECTION_TOKEN) editorConfig: IMonacoEditorConfig
	) {
		super(editorConfig);
	}

	/**
	 * Never called.
	 */
	writeValue(value: any): void {
		this._value = value || '';
		// Fix for value change while dispose in process.
		setTimeout(() => {
			if (this._editor && !this.options.model) {
				this._editor.setValue(this._value);
			}
		});
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	protected initMonaco(options: IStandaloneEditorConstructionOptions2): void {
		const monacoOptions: monacoTypes.editor.IStandaloneEditorConstructionOptions = {...options} as any;
		const hasModel = !!options.model;
		if (hasModel) {
			const uri = options.model.uri ? monaco.Uri.parse(options.model.uri) : undefined as any;
			const model = monaco.editor.getModel(uri);
			if (model) {
				monacoOptions.model = model;
				// model.setValue(this._value);
			} else {
				monacoOptions.model = monaco.editor.createModel(
					options.model.value,
					options.model.language,
					uri
				);
			}
		}
		this._editor = monaco.editor.create(
			this._editorContainer.nativeElement,
			monacoOptions
		);
		if (!hasModel) {
			this._editor.setValue(this._value);
		}
		this._editor.onDidChangeModelContent((e: any) => {
			const value = this._editor.getValue();
			if (value === this._value) {
				return;
			}
			// value is not propagated to parent when executing outside zone.
			this.zone.run(() => {
				// console.log('onDidChangeModelContent', value);
				// this.propagateChange(value);
				this._value = value;
				this.codeChange.next(value);
			});
		});
		this._editor.onDidBlurEditorWidget(() => {
			this.onTouched();
		});
		// refresh layout on resize event.
		if (this._windowResizeSubscription) {
			this._windowResizeSubscription.unsubscribe();
		}
		this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this._editor.layout());
		this.onInit.emit(this._editor);
	}
}
