namespace IImportInfo {


	export interface IImportInfo {
		name: string;
		alias: string;
		row: number;
	}

	export interface IImportInfo2 {
		name: string;
		alias: string;
	}

}
namespace GetImports {
	type IImportInfo = IImportInfo.IImportInfo;



	const REGEXP = /^import ([\w-]+) from '\.\/([\w\-\.]+)';?\s*$/;

	export function DefaultExport__(fileContent: string): IImportInfo[] {
		const lines = fileContent.split('\n');
		return lines.map(processLine).filter(e => e !== undefined) as IImportInfo[];
	}

	function processLine(
		lineText: string,
		row: number
	): IImportInfo | undefined {
		const match = lineText.match(REGEXP);
		if (match === null) {
			return undefined;
		}
		return {
			name: match[2],
			alias: match[1],
			row
		};
	}

}
namespace GetAllDependenciesFilesNames {
	const getImports = GetImports.DefaultExport__;



	interface INgProjectFilesService {
		getFile(fileName: string): string | undefined;
	}

	/**
	 * @param fileName with extension
	 */
	export function DefaultExport__(
		fileName: string,
		ngProjectFilesService: INgProjectFilesService
	): string[] {
		const res: string[] = [];
		getAllDepedenciesFilesNames2(
			fileName,
			ngProjectFilesService,
			res
		);
		return res;
	}

	function getAllDepedenciesFilesNames2(
		fileName: string,
		ngProjectFilesService: INgProjectFilesService,
		res: string[]
	): void {
		if (res.indexOf(fileName) >= 0) {
			return;
		}
		const fileContent = ngProjectFilesService.getFile(fileName);
		if (fileContent === undefined) {
			throw new Error(`no file ${fileName}`);
		}
		const localImports = getImports(fileContent);
		localImports.forEach(e => {
			const dependencyFileName = e.name + '.ts';
			getAllDepedenciesFilesNames2(
				dependencyFileName,
				ngProjectFilesService,
				res
			);
		});
		res.push(fileName);
	}

}
namespace GetFirstNonEmptyCharPos {


	const EMPTY_CHARS = [
		'\n',
		' ',
		'\t'
	];

	export function DefaultExport__(
		text: string,
		firstPos: number
	): number {
		let index = firstPos;
		while (true) {
			const char = text[index];
			if (!EMPTY_CHARS.includes(char)) {
				return index;
			}
			if (index >= text.length) {
				return index;
			}
			index++;
		}
	}

}
namespace GetTsImportsFromNode {
	const ts = Typescript;
	const getFirstNonEmptyCharPos = GetFirstNonEmptyCharPos.DefaultExport__;



	export interface ITsImport {
		importClause: ImportClause;
		moduleSpecifier: string;
		tokenPosition: {
			start: any;
			end: any;
		};
	}

	type ImportClause = string | IDefaultImport | (string | ImportAlias)[];

	interface ImportAlias {
		propertyName: string;
		name: string;
	}

	interface IDefaultImport {
		defaultImport: string;
	}

	export function getTsImportsFromNode(node: ts.SourceFile): ITsImport[] {
		return node.statements.map((e: any) => {
			if (e.importClause === undefined) {
				return undefined;
			}
			const importClause = getImportClause(e.importClause);
			const moduleSpecifier = e.moduleSpecifier.text;
			return {
				importClause,
				moduleSpecifier,
				tokenPosition: {
					start: getFirstNonEmptyCharPos(
						node.text,
						e.pos
					),
					end: e.end
				}
			}
		}).filter(e => e !== undefined) as any;
	}

	function getImportClause(importClause: any): ImportClause | undefined {
		const namedBindings = importClause.namedBindings;
		if (namedBindings === undefined) {
			return {
				defaultImport: importClause.name.escapedText
			};
		}
		if (namedBindings.name !== undefined) {
			return namedBindings.name.escapedText;
		}
		if (namedBindings.elements !== undefined) {
			return namedBindings.elements.map((element: any) => {
				const name = element.name.escapedText;
				if (element.propertyName === undefined) {
					return name;
				}
				return {
					propertyName: element.propertyName.escapedText,
					name
				};
			});
		}
		return undefined;
	}

}
namespace GetTsImports {
	const ts = Typescript;
	const getTsImportsFromNode = GetTsImportsFromNode.getTsImportsFromNode;
	type ITsImport = GetTsImportsFromNode.ITsImport;



	export function getTsImports(fileContent: string): ITsImport[] {
		const node = ts.createSourceFile(
			'fileName',
			fileContent,
			ts.ScriptTarget.Latest
		);
		return getTsImportsFromNode(node);
	}

	export { ITsImport };

}
namespace IsAngularComponent {


	export function isAngularComponent(fileContent: string): boolean {
		return fileContent.match('@Component') !== null;
	}

}
namespace ToPascalCase {


	export function DefaultExport__(text: string): string {
		return text.replace(/(^\w|-\w)/g, clearAndUpper);
	}

	function clearAndUpper(text: string): string {
		return text.replace(/-/, "").toUpperCase();
	}

}
namespace TranspileTs {
	const ts = Typescript;



	const DEFAULT_OPTIONS: ts.TranspileOptions = {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			experimentalDecorators: true,
			emitDecoratorMetadata: true
		}
	};

	export function DefaultExport__(
		source: string,
		options?: ts.TranspileOptions
	): string {
		/**
		 * Default options -- you could also perform a merge,
		 * or use the project tsconfig.json
		 */
		if (options === undefined) {
			options = DEFAULT_OPTIONS;
		}
		return ts.transpileModule(
			source,
			options
		).outputText;
	}

}
namespace CreateNgComponentFromString {
	const angularCommon = AngularCommon;
	const angularCore = AngularCore;
	const rxjs = Rxjs;
	const getAllDepedenciesFilesNames = GetAllDependenciesFilesNames.DefaultExport__;
	const getTsImports = GetTsImports.getTsImports;
	type ITsImport = GetTsImports.ITsImport;
	const isAngularComponent = IsAngularComponent.isAngularComponent;
	const toPascalCase = ToPascalCase.DefaultExport__;
	const transpileTs = TranspileTs.DefaultExport__;



	const AngularCommon = angularCommon;
	const AngularCore = angularCore;
	const Rxjs = rxjs;
	const sharedModules = {
		'@angular/core': 'AngularCore',
		'@angular/common': 'AngularCommon',
		'rxjs': 'Rxjs'
	};

	interface INgProjectFilesService {
		getFile(fileName: string): string | undefined;
	}

	export function DefaultExport__(
		ngComponentFileName: string,
		ngProjectFilesService: INgProjectFilesService
	): any {
		const bundle = bundleFiles(
			ngComponentFileName,
			ngProjectFilesService
		);
		if (bundle === undefined) {
			return undefined;
		}
		const jsCode = transpileTs(bundle);
		const jsClass = eval(jsCode);
		return jsClass;
	}

	function bundleFiles(
		ngComponentFileName: string,
		ngProjectFilesService: INgProjectFilesService
	): string | undefined {
		const fileContent = ngProjectFilesService.getFile(ngComponentFileName);
		if (fileContent === undefined) {
			return undefined;
		}
		let modifiedContent = getNgComponentModifiedContent(
			ngComponentFileName,
			fileContent,
			ngProjectFilesService
		);
		const dependenciesFilesNames = getAllDepedenciesFilesNames(
			ngComponentFileName,
			ngProjectFilesService
		);
		const res = dependenciesFilesNames.map(e => getDependencyFileModifiedContent(
			e,
			ngProjectFilesService
		)).join('\n') + '\n' + modifiedContent;
		return res;
	}

	// function getModifiedContent(fileContent: string): string | undefined {
	// 	let res = fileContent;
	// 	const match = fileContent.match(IMPORT_REGEX);
	// 	if (match !== null) {
	// 		const lastImport = match.slice(-1)[0];
	// 		const index = fileContent.lastIndexOf(lastImport);
	// 		res = fileContent.slice(index + lastImport.length);
	// 	}
	// 	const className = getClassName(res);
	// 	if (className === undefined) {
	// 		return undefined;
	// 	}
	// 	res = res.replace('export default', '');
	// 	return res + '\n' + className;
	// }

	function getNgComponentModifiedContent(
		ngComponentFileName: string,
		fileContent: string,
		ngProjectFilesService: INgProjectFilesService
	): string | undefined {
		let modifiedContent = convertImports(
			ngComponentFileName,
			fileContent
		);
		if (modifiedContent === undefined) {
			return undefined;
		}
		modifiedContent = replaceTemplateAndStylesUrl(
			modifiedContent,
			ngProjectFilesService
		);
		return modifiedContent + '\n' + getGlobalExportedNameFromFileNameWithExtension(ngComponentFileName)
	}

	function replaceTemplateUrl(
		fileContent: string,
		ngProjectFilesService: INgProjectFilesService
	): string {
		const a = fileContent.match(/templateUrl: '\.\/([\w\.-]+)'/);
		if (a === null) {
			return fileContent;
		}
		const templateUrl = a[1];
		const templateFileContent = ngProjectFilesService.getFile(templateUrl);
		if (templateFileContent === undefined) {
			throw new Error(`no file ${templateUrl}`);
		}
		return fileContent.replace(
			a[0],
			`template: \`${templateFileContent}\``
		);
	}

	function replaceStyleUrls(
		fileContent: string,
		ngProjectFilesService: INgProjectFilesService
	): string {
		/**
		 * TODO
		 * multiple scss files
		 */
		const a = fileContent.match(/styleUrls: \['\.\/([\w\.-]+)'\]/);
		if (a === null) {
			return fileContent;
		}
		const styleUrl = a[1];
		const styleFileContent = ngProjectFilesService.getFile(styleUrl);
		if (styleFileContent === undefined) {
			throw new Error(`no file ${styleUrl}`);
		}
		return fileContent.replace(
			a[0],
			`styles: [\`${styleFileContent}\`]`
		);
	}

	function getDependencyFileModifiedContent(
		fileName: string,
		ngProjectFilesService: INgProjectFilesService
	): string | undefined {
		const fileContent = ngProjectFilesService.getFile(fileName);
		if (fileContent === undefined) {
			throw new Error();
		}
		return getModifiedContent2(
			fileName,
			fileContent,
			ngProjectFilesService
		);
	}

	function getModifiedContent2(
		fileNameWithExtension: string,
		fileContent: string,
		ngProjectFilesService: INgProjectFilesService
	): string | undefined {
		let res = convertImports(
			fileNameWithExtension,
			fileContent
		);
		if (res === undefined) {
			return undefined;
		}
		if (!isAngularComponent(fileContent)) {
			return res;
		}
		return replaceTemplateAndStylesUrl(
			res,
			ngProjectFilesService
		);
	}

	function convertImports(
		fileNameWithExtension: string,
		fileContent: string
	): string | undefined {
		const imports = getTsImports(fileContent);
		const importLines = convertImportLines(imports);
		const a = fileContent.match(/export default \w+ ([\w_]+)/);
		if (a === null) {
			return undefined;
		}
		const exportedName = a[1];
		let b = fileContent.replace('export default ', '');
		if (imports.length > 0) {
			b = b.slice(imports.slice(-1)[0]?.tokenPosition.end);
		}
		const globalName = getGlobalExportedNameFromFileNameWithExtension(fileNameWithExtension);
		return `const ${globalName} = (() => {
  ${importLines}

  ${b}
  return ${exportedName};
})();`
	}

	function convertImportLines(
		imports: ITsImport[]
	): string {
		const res: string[] = [];
		imports.forEach(e => {
			const namespace = getNamespace(e.moduleSpecifier);
			if (namespace === undefined) {
				return;
			}
			if (typeof e.importClause === 'string') {
				const line = createAlias(
					e.importClause,
					namespace
				);
				if (line !== undefined) {
					res.push(line);
				}
				return;
			}
			if (!Array.isArray(e.importClause)) {
				const line = createAlias(
					e.importClause.defaultImport,
					namespace
				);
				if (line !== undefined) {
					res.push(line);
				}
				return;
			}
			e.importClause.forEach(element => {
				if (typeof element === 'string') {
					res.push(`const ${element} = ${namespace}.${element};`);
					return;
				}
				res.push(`const ${element.name} = ${namespace}.${element.propertyName};`);
			});
			return;
		});
		return res.join('\n');
	}

	function createAlias(
		alias: string,
		name: string
	): string | undefined {
		if (alias === name) {
			return undefined;
		}
		return `const ${alias} = ${name};`;
	}

	function getNamespace(moduleSpecifier: string): string | undefined {
		const globalNamespace = getGlobalNamespace(moduleSpecifier);
		if (globalNamespace !== undefined) {
			return globalNamespace;
		}
		const match = moduleSpecifier.match(/\.\/([\w\.-]+)/);
		if (match === null) {
			return undefined;
		}
		const fileName = match[1];
		return getGlobalExportedNameFromFileName(fileName);
	}

	function getGlobalNamespace(moduleSpecifier: string): string | undefined {
		return (sharedModules as any)[moduleSpecifier];
	}

	function replaceTemplateAndStylesUrl(
		fileContent: string,
		ngProjectFilesService: INgProjectFilesService
	): string {
		let res = fileContent;
		res = replaceTemplateUrl(
			res,
			ngProjectFilesService
		);
		res = replaceStyleUrls(
			res,
			ngProjectFilesService
		);
		return res;
	}

	function getGlobalExportedNameFromFileNameWithExtension(fileNameWithExtension: string): string {
		let fileName = getFileName(fileNameWithExtension);
		return getGlobalExportedNameFromFileName(fileName);
	}

	function getGlobalExportedNameFromFileName(fileName: string): string {
		const a = fileName.replace('.', '_');
		return toPascalCase(a);
	}

	function getFileName(filePath: string): string {
		const a = filePath.split('.');
		a.pop();
		return a.join('.');
	}

}
namespace ComponentRenderer_component {
	const CommonModule = AngularCommon.CommonModule;
	const Component = AngularCore.Component;
	const debounceTime = Rxjs.debounceTime;
	const Unsubscribable = Rxjs.Unsubscribable;
	const createNgComponentFromString = CreateNgComponentFromString.DefaultExport__;



	const DEBOUNCE_MS = 250;

	/**
	 * To use this component, you should have this line
	 * in main.ts file :
	 * import '@angular/compiler';
	 */
	@Component({
		selector: 'wp-component-renderer',
		standalone: true,
		template: `<p>component-renderer component works</p>`,
		styles: [``],
		imports: [
			CommonModule
		]
	})
	export class DefaultExport__ {
		dynamicComponent: any;

		private readonly _subscriptions: Unsubscribable[] = [];

		constructor(
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

		private get ngComponentFileName(): string | undefined {
			const fileName = this._focusComponentService.focusComponent;
			if (fileName === undefined) {
				return undefined;
			}
			return fileName + '.ts';
		}
	}

}
namespace Frame_component {
	const Component = AngularCore.Component;
	const ComponentRendererComponent = ComponentRenderer_component.DefaultExport__;



	@Component({
		selector: 'wp-frame',
		standalone: true,
		template: `<div>
  <wp-component-renderer></wp-component-renderer>
  <!--<wp-toto></wp-toto>-->
</div>
`,
		styles: [`:host > div {
  height: 100%;
  background-color: #aaa;
}
`],
		imports: [
			ComponentRendererComponent,
			global.TotoComponent
		]
	})
	export class DefaultExport__ { }

}
namespace LeftBar_component {
	const Component = AngularCore.Component;



	@Component({
		selector: 'wp-left-bar',
		standalone: true,
		template: `<div></div>
`,
		styles: [`:host > div {
  width: 300px;
  height: 100%;
  background-color: white;
}
`]
	})
	export class DefaultExport__ { }

}
namespace TopBar_component {
	const Component = AngularCore.Component;



	@Component({
		selector: 'wp-top-bar',
		standalone: true,
		template: `<div></div>
`,
		styles: [`:host > div {
  height: 40px;
  background-color: #333;
}
`]
	})
	export class DefaultExport__ { }

}
namespace DesignTool_component {
	const Component = AngularCore.Component;
	const FrameComponent = Frame_component.DefaultExport__;
	const LeftBarComponent = LeftBar_component.DefaultExport__;
	const TopBarComponent = TopBar_component.DefaultExport__;



	@Component({
		selector: 'wp-design-tool',
		standalone: true,
		template: `<div>
  <wp-top-bar></wp-top-bar>

  <div class="main-content">
    <wp-left-bar></wp-left-bar>

    <wp-frame></wp-frame>

    <div class="right-bar"></div>
  </div>
</div>
`,
		styles: [`:host > div {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  // background-color: #ddd;
}

.right-bar {
  width: 300px;
  background-color: white;
}

wp-frame {
  flex: 1;
}
`],
		imports: [
			FrameComponent,
			LeftBarComponent,
			TopBarComponent
		]
	})
	export class DefaultExport__ { }

}
DesignTool_component.DefaultExport__