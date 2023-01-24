import { getImports } from './get-imports';
import { IDependencyOptions } from './i-dependency-options';
import { IImportInfo } from './i-import-info';
import { isAngularComponent } from './is-angular-component';

type ReadFile = (filePath: string) => Promise<string>;

export async function getDepsOfTypescriptFile(
	file: IDependencyOptions,
	readFile: ReadFile
): Promise<IDependencyOptions[]> {
	const filePath = `${file.fileName}.${file.extension}`;
	const fileContent = await readFile(filePath);
	const imports = getImportsOfFile(fileContent);
	return (await Promise.all(imports.map(async e => {
		try {
			return await convertTypescriptDep(
				e.name,
				e.alias,
				readFile
			);
		} catch (err) {
			return undefined;
		}
	}))).filter(e => e !== undefined) as IDependencyOptions[];
}

function getImportsOfFile(fileContent: string): IImportInfo[] {
	const imports = getImports(fileContent);
	const res: IImportInfo[] = [];
	for (const imp of imports) {
		if (res.some(e => e.alias === imp.alias)) {
			continue;
		}
		res.push(imp);
	}
	return res;
}

export async function convertTypescriptDep(
	fileName: string,
	alias: string,
	readFile: ReadFile
): Promise<IDependencyOptions> {
	const filePath = `${fileName}.ts`;
	const fileContent = await readFile(filePath);
	const imports = getImports(fileContent);
	const isCollapsed = imports.length > 0;
	const isAngular = isAngularComponent(fileContent);
	return {
		alias,
		fileName,
		isCollapsed,
		extension: 'ts',
		type: isAngular ? 'angular' : 'typescript'
		// icon: isAngular ? 'angular' : undefined
	};
}
