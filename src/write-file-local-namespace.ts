import convertImportLines from './convert-import-lines';
import ITsFile from './file-content.interface';
import getMainContent from './get-main-ts-file-content';
import toPascalCase from './to-pascal-case';
import { ICode } from './ts-file.interface';

export default function writeFileLocalNamespace(
	fileName: string,
	tsFile: ITsFile,
	mainSourceCode: ICode,
	transform = (text: string) => text
) {
	const imports = tsFile.imports;
	const importLines = convertImportLines(imports);
	const mainContent = getMainContent(
		mainSourceCode,
		tsFile.fileContent,
		transform
	);
	const fileLocalNamespace = getLocalFileNamespace(fileName);
	const content = `namespace ${fileLocalNamespace} {
	${importLines}

	${mainContent} 
}`;
	return {
		fileLocalNamespace,
		content
	};
}

function getLocalFileNamespace(fileName: string): string {
	const a = getFileNamespace(fileName);
	return `${a}__LOCAL`;
}

function getFileNamespace(fileName: string): string {
	const a = fileName.replace('.', '_');
	return toPascalCase(a);
}
