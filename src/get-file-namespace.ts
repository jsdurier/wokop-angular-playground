import toPascalCase from './to-pascal-case';

export default function getFileNamespace(fileName: string): string {
	const a = fileName.replace('.', '_');
	return toPascalCase(a);
}
