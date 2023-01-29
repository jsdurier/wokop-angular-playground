import * as ts from 'typescript';

import getFirstNonEmptyCharPos from './get-first-non-empty-char-pos';
import insertNewImport from './insert-new-import';

interface IClass {
	className: string;
	fileName: string;
}

export default function importNgServiceInFile(
	fileContent: string,
	data: IClass
): string {
	const fileContentWithNewImport = insertNewImport(
		fileContent,
		data
	);
	return insertInConstructor(
		fileContentWithNewImport,
		data
	);
}

function insertInConstructor(
	fileContent: string,
	data: IClass
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
	const newParamName = `_${lowerFirstChar(data.className)}`;
	const newLine = `    private readonly ${newParamName}: ${data.className}`;
	const constructor = classDeclaration.members.find(e => e.kind === ts.SyntaxKind.Constructor) as ts.SignatureDeclaration;
	if (constructor === undefined) {
		const offset = classDeclaration.members.pos;
		return fileContent.substring(
			0,
			offset
		) + `\n  constructor(
${newLine}
  ) { }` + fileContent.substring(offset);
	}
	if (constructor.parameters.length > 0) {
		let parameterBefore: ts.ParameterDeclaration | undefined = undefined;
		for (const e of constructor.parameters) {
			if ((e.name as any).escapedText > newParamName) {
				break;
			}
			parameterBefore = e;
		}
		if (parameterBefore === undefined) {
			const parameterAfter = constructor.parameters[0];
			const a = getFirstNonEmptyCharPos(
				fileContent,
				parameterAfter.pos
			);
			return fileContent.substring(
				0,
				parameterAfter.pos
			) + `\n${newLine},\n    ` + fileContent.substring(a);
		}
		const textToInsert = `,\n${newLine}`;
		return fileContent.substring(
			0,
			parameterBefore.end
		) + textToInsert + fileContent.substring(parameterBefore.end);
	}
	/**
	 * No params
	 */
	const body = (constructor as any).body;
	const offset = body.pos - 1;
	return fileContent.substring(
		0,
		offset
	) + `\n${newLine}\n  ` + fileContent.substring(offset);
}

function lowerFirstChar(text: string): string {
	return text.charAt(0).toLowerCase() + text.slice(1);
}
