import * as ts from 'typescript';

import parseTsFile from './parse-ts-file';
import { ICode, IDeclaration, IExport } from './ts-file.interface';

interface IDeclarationExportable extends IDeclaration {
	exportType?: ExportType;
}

enum ExportType {
	DEFAULT,
	CLASSIC
}

export default function transformStatements(
	statements: ts.Statement[],
	fileContent: string
): ICode {
	const res: ICode = {
		declarations: [],
		exports: []
	};
	statements.forEach(statement => {
		if (isDeclarationStatement(statement)) {
			const a = processDeclarationStatement(
				statement,
				fileContent
			);
			res.declarations.push(a);
			switch (a.exportType) {
				case ExportType.CLASSIC:
					res.exports.push({
						name: a.name
					});
					break;
				case ExportType.DEFAULT:
					res.defaultExportName = a.name;
					break;
			}
			return;
		}
		if (isExportDeclaration(statement)) {
			res.exports.push(...processExportDeclaration(statement));
			return;
		}
		if (isExportAssignment(statement)) {
			res.defaultExportName = processExportAssignement(statement);
			return;
		}
		console.log('statement ignored');
		console.log(statement);
	});
	// console.log(res);
	return res;
}

function processExportAssignement(statement: ts.ExportAssignment): string | undefined {
	if (!isIdentifier(statement.expression)) {
		return undefined;
	}
	return statement.expression.escapedText as string;
}

function isIdentifier(data: ts.Expression): data is ts.Identifier {
	return (data as ts.Identifier).kind === ts.SyntaxKind.Identifier;
}

function processDeclarationStatement(
	declaration: ts.DeclarationStatement,
	fileContent: string
): IDeclarationExportable {
	const exportKeyword = declaration.modifiers?.find(e => e.kind === ts.SyntaxKind.ExportKeyword);
	const defaultKeyword = exportKeyword === undefined ?
		undefined :
		declaration.modifiers?.find(e => e.kind === ts.SyntaxKind.DefaultKeyword);
	const name = getName(declaration);
	const kind = declaration.kind;
	const exportType = exportKeyword === undefined ?
		undefined :
		(defaultKeyword === undefined ?
			ExportType.CLASSIC :
			ExportType.DEFAULT);
	// const start = exportKeyword === undefined ?
	// 	declaration.pos :
	// 	(defaultKeyword === undefined ?
	// 		exportKeyword.end :
	// 		defaultKeyword.end);
	// const start = declaration.pos;
	/**
	 * TODO-789
	 * supprimer le mot default.
	 */
	const wordsToExclude = [
		exportKeyword,
		defaultKeyword
	].filter(e => e !== undefined) as ts.Modifier[];
	const rangeToExclude = wordsToExclude.length === 0 ? undefined : {
		from: wordsToExclude[0].pos,
		to: wordsToExclude.slice(-1)[0].end
	};
	const text = rangeToExclude === undefined ?
		fileContent.substring(declaration.pos, declaration.end) :
		fileContent.substring(declaration.pos, rangeToExclude.from) + fileContent.substring(rangeToExclude.to);
	console.log('text=');
	console.log(text);
	console.log('-------------');
	const declarationStart = rangeToExclude !== undefined ?
		rangeToExclude.from - declaration.pos :
		/**
		 * TODO si il y a un décorateur, le début de la déclaration doit
		 * être différent.
		 */
		declaration.pos;
	return {
		exportType,
		name,
		text,
		declarationStart,
		kind
	};
}

function processExportDeclaration(data: ts.ExportDeclaration): IExport[] {
	const exportClause = data.exportClause;
	console.log(exportClause);
	if (!isNamedExports(exportClause)) {
		return [];
	}
	return exportClause.elements.map(e => {
		const propertyName = e.propertyName?.escapedText as string;
		const name = e.name.escapedText as string;
		return {
			propertyName,
			name
		};
	});
}

function isNamedExports(data: ts.NamedExportBindings | undefined): data is ts.NamedExports {
	return (data as ts.NamedExports).kind === ts.SyntaxKind.NamedExports;
}

function isDeclarationStatement(data: ts.Statement): data is ts.DeclarationStatement {
	return (data as ts.DeclarationStatement).name !== undefined;
}

function isExportDeclaration(data: ts.Statement): data is ts.ExportDeclaration {
	return (data as ts.ExportDeclaration).kind === ts.SyntaxKind.ExportDeclaration;
}

function isExportAssignment(data: ts.Statement): data is ts.ExportAssignment {
	return (data as ts.ExportAssignment).kind === ts.SyntaxKind.ExportAssignment;
}

function getName(declaration: ts.DeclarationStatement): string {
	const name = declaration.name;
	if (name === undefined) {
	}
	const identifier = name as ts.Identifier;
	const escapedText = identifier.escapedText;
	if (escapedText === undefined) {
		throw new Error();
	}
	return escapedText;
}

// const statements = sourceFile.statements.map(e => {
// 	const declaration = e as ts.DeclarationStatement;
// 	const name = declaration.name;
// 	if (name === undefined) {
// 		return undefined;
// 	}
// 	const identifier = name as ts.Identifier;
// 	const escapedText = identifier.escapedText;
// 	if (escapedText === undefined) {
// 		return undefined;
// 	}
// 	return {
// 		name: escapedText,
// 		type: declaration.kind
// 	};
// }).filter(e => e !== undefined);

// console.log(statements);
