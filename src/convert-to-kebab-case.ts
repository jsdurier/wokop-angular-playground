export function convertToKebabCase(text: string): string {
	const match = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
	if (match === null) {
		return '';
	}
	return match.map(x => x.toLowerCase()).join('-');
}
