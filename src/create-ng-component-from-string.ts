import * as angularCommon from '@angular/common';
import * as angularCore from '@angular/core';
import 'reflect-metadata';
import * as rxjs from 'rxjs';
import * as ts from 'typescript';

import bundleAngularComponent from './bundle-angular-component';
import bundleFiles from './bundle-files';
import ComponentRendererComponent from './component-renderer.component';
import TotoComponent from './toto.component';
import transpileTs from './transpile-ts';

const AngularCommon = angularCommon;
const AngularCore = angularCore;
const Rxjs = rxjs;
const Typescript = ts;
// const TotoComponent = totoComponent;
const sharedModules = {
	'@angular/core': 'AngularCore',
	'@angular/common': 'AngularCommon',
	'rxjs': 'Rxjs',
	'typescript': 'Typescript'
};
const global = {
	TotoComponent,
	ComponentRendererComponent
	// CompileComponentComponent
};

interface INgProjectFilesService {
	getFile(fileName: string): string | undefined;
}

export default function createNgComponentFromString(
	ngComponentFileName: string,
	ngProjectFilesService: INgProjectFilesService
): any {
	/**
	 * TODO-789 voir si pas de régression
	 */
	const bundle = bundleAngularComponent( // bundleFiles(
		ngComponentFileName,
		ngProjectFilesService
	);
	if (bundle === undefined) {
		return undefined;
	}
	// console.warn('---------------------');
	// console.log(bundle);
	const jsCode = transpileTs(bundle);
	const jsClass = eval(jsCode);
	return jsClass;
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
