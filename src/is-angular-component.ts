export function isAngularComponent(fileContent: string): boolean {
	return fileContent.match('@Component') !== null;
}
