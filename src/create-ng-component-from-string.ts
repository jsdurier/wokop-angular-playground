import * as angularCommon from '@angular/common';
import * as angularCore from '@angular/core';
import 'reflect-metadata';

import { getImports } from './get-imports';
import {
	getTsImports,
	ITsImport
} from './get-ts-imports';
import { isAngularComponent } from './is-angular-component';
import toPascalCase from './to-pascal-case';
import transpileTs from './transpile-ts';

const AngularCommon = angularCommon;
const AngularCore = angularCore;
const sharedModules = {
	'@angular/core': 'AngularCore',
	'@angular/common': 'AngularCommon',
	'rxjs': 'Rxjs'
};

interface INgProjectFilesService {
	getFile(fileName: string): string | undefined;
}

export default function createNgComponentFromString(
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

function getAllDepedenciesFilesNames(
	fileName: string,
	ngProjectFilesService: INgProjectFilesService
): string[] {
	const res: string[] = [];
	const fileContent = ngProjectFilesService.getFile(fileName);
	if (fileContent === undefined) {
		throw new Error(`no file ${fileName}`);
	}
	const localImports = getImports(fileContent);
	localImports.forEach(e => {
		/**
		 * TODO
		 * prendre en compte e.alias
		 */
		const dependencyFileName = e.name + '.ts';
		const array = getAllDepedenciesFilesNames(
			dependencyFileName,
			ngProjectFilesService
		).concat(dependencyFileName)
		let ref = 0;
		for (const e of array) {
			const i = res.indexOf(e);
			if (i >= 0) {
				ref = i;
			} else {
				res.splice(
					ref,
					0,
					e
				);
				ref++;
			}
		}
	});
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
