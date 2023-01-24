import { TS_EXTENSION } from './ts-extension';

export function getTypescriptFileName(fileName: string): string {
	return `${fileName}${TS_EXTENSION}`;
}
