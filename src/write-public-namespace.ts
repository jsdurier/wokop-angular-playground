import DEFAULT_EXPORT_NAME from './default-export-name';
import ITsFile from './file-content.interface';
import getFileNamespace from './get-file-namespace';
import { ICode } from './ts-file.interface';

export default function writePublicNamespace(
	fileName: string,
	tsFile: ITsFile,
	mainSourceCode: ICode,
	fileLocalNamespace: string
): string | undefined {
	const allExports = [...mainSourceCode.exports];
	if (mainSourceCode.defaultExportName !== undefined) {
		allExports.splice(
			0,
			0,
			{
				name: DEFAULT_EXPORT_NAME,
				propertyName: mainSourceCode.defaultExportName
			}
		);
	}
	const mainContent = allExports.map(e => {
		return createExportImport(
			e.name,
			e.propertyName ?? e.name,
			fileLocalNamespace
		);
	}).join('\n');
	const fileNamespace = getFileNamespace(fileName);
	return `namespace ${fileNamespace} {
${mainContent}
}`;
}

function createExportImport(
	name: string,
	propertyName: string,
	fileLocalNamesapce: string
): string {
	return `export import ${name} = ${fileLocalNamesapce}.${propertyName}`;
}
