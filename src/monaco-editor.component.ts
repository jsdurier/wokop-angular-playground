// import {
// 	Component,
// 	EventEmitter,
// 	Input,
// 	Output,
// 	ViewChild
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import {
// 	EditorComponent,
// 	MonacoEditorModule,
// 	NGX_MONACO_EDITOR_CONFIG
// } from 'ngx-monaco-editor';

// const DEFAULT_THEME = 'vs-dark';
// const EXTENSION_LANGUAGE_MAPPING = {
// 	ts: 'typescript',
// 	html: 'html',
// 	scss: 'scss'
// };

// declare var monaco: any;
// let isMoncaoInit = false;

// @Component({
// 	selector: 'wp-monaco-editor',
// 	standalone: true,
// 	imports: [
// 		FormsModule,
// 		MonacoEditorModule
// 	],
// 	providers: [
// 		{
// 			provide: NGX_MONACO_EDITOR_CONFIG,
// 			useValue: {}
// 		}
// 	],
// 	templateUrl: './monaco-editor.component.html',
// 	styleUrls: ['./monaco-editor.component.scss']
// })
// export default class MonacoEditorComponent {
// 	@Input() set code(value: string) {
// 		if (value === this._codeInEditor) {
// 			/**
// 			 * To avoid a refresh of the ngx-monaco-editor
// 			 * component.
// 			 */
// 			return;
// 		}
// 		this.code_ = value;	
// 	}
// 	@Input() extension!: string;

// 	@Output() codeChange = new EventEmitter<string>();

// 	code_!: string;
// 	editorOptions: any;

// 	private _codeInEditor!: string;

// 	@ViewChild('editor') editor!: EditorComponent;
// 	// code = 'function x() {\nconsole.log("Hello world!");\n}';

// 	ngOnInit(): void {
// 		// if (!isMoncaoInit) {
// 		// 	isMoncaoInit = true;
// 		// 	setTimeout(
// 		// 		() => {
// 		// 			console.log('createModel');
// 		// 			monaco.editor.createModel(
// 		// 				'const foo = 1;',
// 		// 				'typescript',
// 		// 				'app.component.ts' // monaco.Uri.file('app.component.ts')
// 		// 			);
// 		// 			monaco.editor.createModel(
// 		// 				'const foo = 1;',
// 		// 				'typescript',
// 		// 				'main.ts' // monaco.Uri.file('main.ts')
// 		// 			);
// 		// 		},
// 		// 		3000
// 		// 	);
// 		// }
// 		this.editorOptions = {
// 			theme: DEFAULT_THEME,
// 			language: getLanguage(this.extension),
// 			// model: {
// 			// 	value: this.code,
// 			// 	language: getLanguage(this.extension),
// 			// 	uri: 'main.ts' // monaco.Uri.file('main.ts')
// 			// }
// 		};
// 	}

// 	ngAfterViewInit(): void {
// 		this.editor.registerOnChange((e: string) => {
// 			console.log('registerOnChange', e);
// 			this._codeInEditor = e;
// 			this.codeChange.emit(e);
// 		});
// 		setTimeout(
// 			() => {
// 				const editor = (this.editor as any)._editor;
// 				if (editor === undefined) {
// 					console.error('editor undefined');
// 					return;
// 				}
// 				const editorService = editor._codeEditorService;
// 				const openEditorBase = editorService.openCodeEditor.bind(editorService);
// 				editorService.openCodeEditor = async (input: any, source: any) => {
// 					console.log('openCodeEditor', input, source);
// 					// const result = await openEditorBase(input, source);
// 					// if (result === null) {
// 					// console.log('Open definition for:', input);
// 					// console.log('Corresponding model:', monaco.editor.getModel(input.resource));
// 					// }
// 					// return result; // always return the base result
// 				};
// 			},
// 			1000
// 		);
// 	}
// }

// function getLanguage(extension: string): string {
// 	return (EXTENSION_LANGUAGE_MAPPING as any)[extension];
// }
