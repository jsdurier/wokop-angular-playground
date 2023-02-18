import getImports from './get-imports';
import { getTsImports } from './get-ts-imports';

interface INgProjectFilesService {
	getFile(fileName: string): string | undefined;
}

/**
 * @param fileName with extension
 */
export default function getAllDepedenciesFilesNames(
	fileName: string,
	ngProjectFilesService: INgProjectFilesService
): string[] {
	const res: string[] = [];
	getAllDepedenciesFilesNames2(
		fileName,
		ngProjectFilesService,
		res
	);
	return res;
}

function getAllDepedenciesFilesNames2(
	fileName: string,
	ngProjectFilesService: INgProjectFilesService,
	res: string[]
): void {
	if (res.indexOf(fileName) >= 0) {
		return;
	}
	const fileContent = ngProjectFilesService.getFile(fileName);
	if (fileContent === undefined) {
		throw new Error(`no file ${fileName}`);
	}
	// const localImports = getImports(fileContent);
	const localImports = getTsImports(fileContent);
	localImports.forEach(e => {
		if (!e.moduleSpecifier.startsWith('./')) {
			return;
		}
		const dependencyFileName = e.moduleSpecifier.slice(2) + '.ts';
		getAllDepedenciesFilesNames2(
			dependencyFileName,
			ngProjectFilesService,
			res
		);
	});
	res.push(fileName);
}
