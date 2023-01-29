import { getTsImports } from './get-ts-imports';

const LOCAL_IMPORT_PREFIX = './';

interface IClass {
	className: string;
	fileName: string;
}

export default function insertNewImport(
	fileContent: string,
	data: IClass
): string {
	const imports = getTsImports(fileContent);
	let offset = 0;
	let beforeNewLine = '\n\n';
	let afterNewLine = '';
	for (const importClause of imports) {
		const moduleSpecifier = importClause.moduleSpecifier;
		if (moduleSpecifier.startsWith(LOCAL_IMPORT_PREFIX)) {
			const a = moduleSpecifier.slice(LOCAL_IMPORT_PREFIX.length);
			if (data.fileName < a) {
				beforeNewLine = '';
				afterNewLine = '\n';
				offset = importClause.tokenPosition.start;
				break;
			}
			beforeNewLine = '\n';
		}
		offset = importClause.tokenPosition.end;
	}
	const newLine = `import ${data.className} from './${data.fileName}';`;
	return fileContent.substring(
		0,
		offset
	) + beforeNewLine + newLine + afterNewLine + fileContent.substring(offset);
}
