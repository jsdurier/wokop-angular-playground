import * as ts from 'typescript';

export function getTsImports(fileContent: string) {
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
			moduleSpecifier
		}
	}).filter(e => e !== undefined);
}

function getImportClause(importClause: any) {
	const namedBindings = importClause.namedBindings;
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
