import * as ts from 'typescript';

import getFirstNonEmptyCharPos from './get-first-non-empty-char-pos';

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
