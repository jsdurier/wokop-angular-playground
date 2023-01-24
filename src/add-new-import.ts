interface IImportInFile {
	name: string;
	row: number;
}

interface IImport {
	alias: string;
	name: string;
}

const LOCAL_IMPORT_PREFIX = './';

export default function addNewImport(
	newImport: IImport,
	importerFileContent: string
): string {
	const lines = importerFileContent.split('\n');
	const allImports = getImports(lines);
	let row = 0;
	let spaceBefore = false;
	for (const e of allImports) {
		if (!e.name.startsWith(LOCAL_IMPORT_PREFIX)) {
			row = e.row + 1;
			spaceBefore = true;
			continue;
		}
		const existingImportName = e.name.slice(LOCAL_IMPORT_PREFIX.length);
		spaceBefore = false;
		if (newImport.name < existingImportName) {
			row = e.row;
			break;
		}
		row = e.row + 1;
	}
	const newLine = `import ${newImport.alias} from './${newImport.name}';`;
	lines.splice(
		row,
		0,
		newLine
	);
	if (spaceBefore) {
		lines.splice(
			row,
			0,
			''
		);
	}
	return lines.join('\n');
}

const REGEXP = /from '([^']+)';?\s*$/;

function getImports(lines: string[]): IImportInFile[] {
	return lines.map(processLine).filter(e => e !== undefined) as IImportInFile[];
}

function processLine(
	lineText: string,
	row: number
): IImportInFile | undefined {
	const match = lineText.match(REGEXP);
	if (match === null) {
		return undefined;
	}
	return {
		name: match[1],
		row
	};
}
