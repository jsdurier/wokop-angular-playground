export function camalize(text: string): string {
	return text.toLowerCase().replace(
		/[^a-zA-Z0-9]+(.)/g,
		(m, chr) => chr.toUpperCase()
	);
}
