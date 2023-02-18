import transformStatements from './transform-statements';
import DEFAULT_EXPORT_NAME from './default-export-name';
import ITsFile from './file-content.interface';
import IFileNameRecord from './file-name-record.interface';
import getAllDependencies from './get-all-dependencies';
import getFileNamespace from './get-file-namespace';
import IProjectFilesService from './project-files.interface';
import writeFileLocalNamespace from './write-file-local-namespace';
import writePublicNamespace from './write-public-namespace';

/**
 * Build a single typescript code from multiple source codes.
 */
export default function bundleTsFile(
	fileName: string,
	projectFilesService: IProjectFilesService,
	transform = (text: string) => text
): string {
	const fileContent = projectFilesService.getFile(fileName);
	if (fileContent === undefined) {
		throw new Error();
	}
	const allDependencies = getAllDependencies(
		fileName,
		projectFilesService
	);
	const finalInstruction = getFileNamespace(fileName) + '.' + DEFAULT_EXPORT_NAME;
	return Object.keys(allDependencies).map(fileName => {
		return getDependencyFileModifiedContent(
			fileName,
			allDependencies,
			transform
		);
	}).join('\n') + '\n' + finalInstruction;
}

function getDependencyFileModifiedContent(
	fileName: string,
	allDependencies: IFileNameRecord<ITsFile>,
	transform = (text: string) => text
): string | undefined {
	const tsFile = allDependencies[fileName];
	const mainSourceCode = transformStatements(
		tsFile.otherStatements,
		tsFile.fileContent
	);
	console.log('mainSourceCode');
	console.log(mainSourceCode);
	const localNamespace = writeFileLocalNamespace(
		fileName,
		tsFile,
		mainSourceCode,
		transform
	);
	const publicNamespace = writePublicNamespace(
		fileName,
		tsFile,
		mainSourceCode,
		localNamespace.fileLocalNamespace
	);
	return localNamespace.content + '\n' + publicNamespace;
}
