import * as angularCommon from '@angular/common';
import * as angularCore from '@angular/core';
import 'reflect-metadata';

import { getImports } from './get-imports';
import INgProjectFilesService from './i-ng-project-files-service';
import { isAngularComponent } from './is-angular-component';
import transpileTs from './transpile-ts';

const Component = angularCore.Component;
const NgIf = angularCommon.NgIf;
const Injectable = angularCore.Injectable;

const IMPORT_REGEX = /import [\w{}\s,]+ from '.+';/g;

/**
 * @returns javascript class
 */
export default function createNgComponentFromString(
	ngComponentFileName: string,
	ngProjectFilesService: INgProjectFilesService
): any {
	const fileContent = ngProjectFilesService.getFile(ngComponentFileName);
	if (fileContent === undefined) {
		return undefined;
	}
	let modifiedContent = getNgComponentModifiedContent(
		fileContent,
		ngProjectFilesService
	);
	if (modifiedContent === undefined) {
		return undefined;
	}
	const dependenciesFilesNames = getAllDepedenciesFilesNames(
		ngComponentFileName,
		ngProjectFilesService
	);
	const allCode = dependenciesFilesNames.map(e => getDependencyFileModifiedContent(
		e,
		ngProjectFilesService
	)).join('\n') + '\n' + modifiedContent;
	// console.log(allCode);
	const jsCode = transpileTs(allCode);
	const jsClass = eval(jsCode);
	return jsClass;
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
	fileContent: string,
	ngProjectFilesService: INgProjectFilesService
): string | undefined {
	let res = fileContent;
	const match = fileContent.match(IMPORT_REGEX);
	if (match !== null) {
		const lastImport = match.slice(-1)[0];
		const index = fileContent.lastIndexOf(lastImport);
		res = fileContent.slice(index + lastImport.length);
	}
	const className = getClassName(res);
	if (className === undefined) {
		return undefined;
	}
	res = res.replace('export default', '');
	res = replaceTemplateAndStylesUrl(
		res,
		ngProjectFilesService
	);
	return res + '\n' + className;
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
): string {
	const fileContent = ngProjectFilesService.getFile(fileName);
	if (fileContent === undefined) {
		throw new Error();
	}
	return getModifiedContent2(
		fileContent,
		ngProjectFilesService
	);
}

function getModifiedContent2(
	fileContent: string,
	ngProjectFilesService: INgProjectFilesService
): string {
	let res = fileContent;
	const match = fileContent.match(IMPORT_REGEX);
	if (match !== null) {
		const lastImport = match.slice(-1)[0];
		const index = fileContent.lastIndexOf(lastImport);
		res = fileContent.slice(index + lastImport.length);
	}
	res = res.replace('export default', '');
	if (!isAngularComponent(fileContent)) {
		return res;
	}
	return replaceTemplateAndStylesUrl(
		res,
		ngProjectFilesService
	);
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

function getClassName(fileContent: string): string | undefined {
	const a = fileContent.match(/export default class (\w+)/);
	if (a === null) {
		return undefined;
	}
	return a[1];
}
