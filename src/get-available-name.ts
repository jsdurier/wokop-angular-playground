import { TS_EXTENSION } from './ts-extension';

const FIRST_COUNT = 2;

export async function getAvailableName(
	fileNames: string[],
	name: string
): Promise<string> {
	const allExistingNames = await getTypescriptNames(fileNames);
	if (allExistingNames.indexOf(name) < 0) {
		return name;
	}
	return getAvailableNameWithSuffix(
		allExistingNames,
		name,
		FIRST_COUNT
	);
}

function getAvailableNameWithSuffix(
	allExistingNames: string[],
	name: string,
	counter: number
): string {
	const a = name.split('.');
	a[0] = `${a[0]}-${counter}`;
	const nameWithCounter = a.join('.');
	if (allExistingNames.indexOf(nameWithCounter) < 0) {
		return nameWithCounter;
	}
	return getAvailableNameWithSuffix(
		allExistingNames,
		name,
		counter + 1
	);
}

/**
 * @returns file names without .ts extension.
 */
async function getTypescriptNames(fileNames: string[]): Promise<string[]> {
	const typescriptFiles = fileNames.map(e => {
		if (!e.endsWith(TS_EXTENSION)) {
			return undefined;
		}
		return e.slice(
			0,
			e.length - TS_EXTENSION.length
		);
	}).filter(e => e !== undefined);
	return typescriptFiles as string[];
}
