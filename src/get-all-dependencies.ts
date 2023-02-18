import * as ts from 'typescript';

import ITsFile from './file-content.interface';
import IFileNameRecord from './file-name-record.interface';
import getTsImport from './get-ts-import';
import IProjectFilesService from './project-files.interface';
import ITsImport from './ts-import.interface';

/**
 * @param fileName with extension
 */
export default function getAllDependencies(
	fileName: string,
	ngProjectFilesService: IProjectFilesService
): IFileNameRecord<ITsFile> {
	const res: IFileNameRecord<ITsFile> = {};
	getAllDepedenciesFilesNames2(
		fileName,
		ngProjectFilesService,
		res
	);
	return res;
}

function getAllDepedenciesFilesNames2(
	fileName: string,
	ngProjectFilesService: IProjectFilesService,
	res: IFileNameRecord<ITsFile>
): void {
	if (res[fileName] !== undefined) {
		return;
	}
	const fileContent = ngProjectFilesService.getFile(fileName);
	if (fileContent === undefined) {
		throw new Error(`no file ${fileName}`);
	}
	const sourceFile = ts.createSourceFile(
		'fileName',
		fileContent,
		ts.ScriptTarget.Latest
	);
	const imports: ITsImport[] = [];
	const otherStatements: ts.Statement[] = [];
	sourceFile.statements.forEach(e => {
		if (!isImportDeclaration(e)) {
			otherStatements.push(e);
			return;
		}
		const imp = getTsImport(e);
		if (imp === undefined) {
			return;
		}
		imports.push(imp);
	});
	// const imports = getTsImportsFromNode(sourceFile);
	imports.forEach(e => {
		if (!e.moduleSpecifier.startsWith('./')) {
			return;
		}
		const dependencyFileName = e.moduleSpecifier.slice(2);
		getAllDepedenciesFilesNames2(
			dependencyFileName,
			ngProjectFilesService,
			res
		);
	});
	res[fileName] = {
		otherStatements,
		imports,
		fileContent
	};
}

function isImportDeclaration(data: ts.Statement): data is ts.ImportDeclaration {
	return (data as ts.ImportDeclaration).importClause !== undefined;
}
