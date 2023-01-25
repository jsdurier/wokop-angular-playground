import addNewImport from './add-new-import';

export default function importInFile(
	importerFileContent: string,
	className: string,
	fileName: string
): string {
	const newFileContent = addNewImport(
		{
			alias: className,
			name: fileName
		},
		importerFileContent
	);
	return newFileContent;
}
