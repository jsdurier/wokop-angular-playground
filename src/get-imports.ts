import { IImportInfo } from './i-import-info';

const REGEXP = /^import ([\w-]+) from '\.\/([\w\-\.]+)';?\s*$/;

export function getImports(fileContent: string): IImportInfo[] {
	const lines = fileContent.split('\n');
	return lines.map(processLine).filter(e => e !== undefined) as IImportInfo[];
}

function processLine(
	lineText: string,
	row: number
): IImportInfo | undefined {
	const match = lineText.match(REGEXP);
	if (match === null) {
		return undefined;
	}
	return {
		name: match[2],
		alias: match[1],
		row
	};
}
