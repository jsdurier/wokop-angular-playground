import { ITsImport } from './get-ts-imports-from-node';
import toPascalCase from './to-pascal-case';

import DEFAULT_EXPORT_NAME from './default-export-name';

const sharedModules = {
	'@angular/core': 'AngularCore',
	'@angular/common': 'AngularCommon',
	'rxjs': 'Rxjs',
	'typescript': 'Typescript'
};

export default function convertImportLines(imports: ITsImport[]): string {
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
			const defaultImport = e.importClause.defaultImport;
			const line = createAlias(
				defaultImport,
				`${namespace}.${DEFAULT_EXPORT_NAME}`
			);
			if (line !== undefined) {
				res.push(line);
			}
			return;
		}
		e.importClause.forEach(element => {
			if (typeof element === 'string') {
				res.push(createImport(
					element,
					`${namespace}.${element}`
				));
				return;
			}
			res.push(createImport(
				element.name,
				`${namespace}.${element.propertyName}`
			));
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
	return createImport(
		alias,
		name
	);
}

function createImport(
	alias: string,
	name: string
): string {
	return `import ${alias} = ${name};`;
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
	return getFileNamespace(fileName);
}

function getFileNamespace(fileName: string): string {
	const a = fileName.replace('.', '_');
	return toPascalCase(a);
}

function getGlobalNamespace(moduleSpecifier: string): string | undefined {
	return (sharedModules as any)[moduleSpecifier];
}
