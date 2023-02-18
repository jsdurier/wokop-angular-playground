import * as ts from 'typescript';

import ImportClause from './import-clause';
import ITsImport from './ts-import.interface';

export default function getTsImport(e: ts.ImportDeclaration): ITsImport | undefined {
		const importClause = getImportClause(e.importClause);
		if (importClause === undefined) {
			return undefined;
		}
		const moduleSpecifier = (e.moduleSpecifier as any).text;
		return {
			importClause,
			moduleSpecifier,
			tokenPosition: {
				start: e.pos,
				end: e.end
			}
		};
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
