import * as ts from 'typescript';

import insertNewImport from './insert-new-import';

interface IClass {
	className: string;
	fileName: string;
}

export default function importNgComponentInFile(
	fileContent: string,
	data: IClass
): string {
	const fileContentWithNewImport = insertNewImport(
		fileContent,
		data
	);
	return insertInImportsSection(
		fileContentWithNewImport,
		data.className
	);
}

function insertInImportsSection(
	fileContent: string,
	componentClassName: string
): string {
	const node = ts.createSourceFile(
		'fileName',
		fileContent,
		ts.ScriptTarget.Latest
	);
	const classDeclaration = node.statements.find(e => e.kind === ts.SyntaxKind.ClassDeclaration) as ts.ClassDeclaration;
	if (classDeclaration === undefined) {
		return fileContent;
	}
	if (classDeclaration.decorators === undefined) {
		return fileContent;
	}
	const expression = classDeclaration.decorators[0].expression as ts.CallExpression;
	const properties = (expression.arguments[0] as ts.ObjectLiteralExpression).properties;
	const imports = properties.find(e => (e.name as ts.Identifier).escapedText === 'imports');
	if (imports === undefined) {
		/**
		 * TODO ordre alphabétique
		 */
		const lastProperty = properties.slice(-1)[0];
		return fileContent.substring(
			0,
			lastProperty.end
		) + `,\n  imports: [
    ${componentClassName}
  ]` + fileContent.substring(lastProperty.end);
	}
	const elements = (imports as any).initializer.elements as ts.Identifier[];
	let elementBefore: ts.Identifier | undefined = undefined;
	for (const e of elements) {
		if (e.escapedText > componentClassName) {
			break;
		}
		elementBefore = e;
	}
	if (elementBefore === undefined) {
		if (elements.length === 0) {
			const offset = (elements as any).pos;
			return fileContent.substring(
				0,
				offset
			) +
			`\n    ${componentClassName}` +
			fileContent.substring(offset);
		}
		return fileContent.substring(
			0,
			elements[0].pos,
		) +
			`\n    ${componentClassName},` +
			fileContent.substring(elements[0].pos)
	}
	return fileContent.substring(
		0,
		elementBefore.end,
	) +
		`,\n    ${componentClassName}` +
		fileContent.substring(elementBefore.end);
}
