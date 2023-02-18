import getAllDepedenciesFilesNames from './get-all-dependencies-files-names';
import { getTsImports } from './get-ts-imports';
import { ITsImport } from './get-ts-imports-from-node';
import { isAngularComponent } from './is-angular-component';
import toPascalCase from './to-pascal-case';

const sharedModules = {
	'@angular/core': 'AngularCore',
	'@angular/common': 'AngularCommon',
	'rxjs': 'Rxjs',
	'typescript': 'Typescript'
};
const DEFAULT_EXPORT = 'DefaultExport__';

interface INgProjectFilesService {
	getFile(fileName: string): string | undefined;
}

/**
 * @deprecated
 */
export default function bundleFiles(
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
	dependenciesFilesNames.pop();
	// console.log('dependenciesFilesNames', dependenciesFilesNames);
	const res = dependenciesFilesNames.map(e => getDependencyFileModifiedContent(
		e,
		ngProjectFilesService
	)).join('\n') + '\n' + modifiedContent;
	return res;
}

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
	const a = getGlobalExportedNameFromFileNameWithExtension(ngComponentFileName) + '.' + DEFAULT_EXPORT;
	modifiedContent = replaceTemplateAndStylesUrl(
		modifiedContent,
		ngProjectFilesService
	);
	return modifiedContent + '\n' + a;
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
	let b = fileContent;
	if (imports.length > 0) {
		b = b.slice(imports.slice(-1)[0]?.tokenPosition.end);
	}
	b = b.replace(/export default \w+ ([\w_]+)/, (...args: any[]) => {
		const a = args[0].replace(args[1], DEFAULT_EXPORT);
		return a.replace('export default ', 'export ');
	});
	const globalName = getGlobalExportedNameFromFileNameWithExtension(fileNameWithExtension);
	// return `const ${globalName} = (() => {
	//   ${importLines}

	//   ${b}
	//   return ${exportedName};
	// })();`
	return `namespace ${globalName} {
	${importLines}

	${b} 
}`;
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
				`${namespace}.${DEFAULT_EXPORT}`
			);
			if (line !== undefined) {
				res.push(line);
			}
			return;
		}
		e.importClause.forEach(element => {
			if (typeof element === 'string') {
				const keyword = isType(
					element,
					e.moduleSpecifier
				) ? 'type' : 'const';
				res.push(`${keyword} ${element} = ${namespace}.${element};`);
				return;
			}
			const keyword = isType(
				element.name,
				e.moduleSpecifier
			) ? 'type' : 'const';
			res.push(`${keyword} ${element.name} = ${namespace}.${element.propertyName};`);
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

function isType(
	name: string,
	moduleSpecifier: string
): boolean {
	/**
	 * TODO
	 */
	return name.startsWith('I') && isUpperCase(name[1]);
}

function isUpperCase(value: string): boolean {
	return value == value.toUpperCase() && value != value.toLocaleLowerCase();
}
