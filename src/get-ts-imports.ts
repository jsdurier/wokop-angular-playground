import * as ts from 'typescript';

export interface ITsImport {
	importClause: ImportClause;
	moduleSpecifier: any;
	tokenPosition: {
		start: any;
		end: any;
	};
}

type ImportClause = string | IDefaultImport | (string | ImportAlias)[];

interface ImportAlias {
	propertyName: string;
	name: string;
}

interface IDefaultImport {
	defaultImport: string;
}

export function getTsImports(fileContent: string): ITsImport[] {
	const node = ts.createSourceFile(
		'fileName',
		fileContent,
		ts.ScriptTarget.Latest
	);
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
				start: e.pos,
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
