const EMPTY_CHARS = [
	'\n',
	' ',
	'\t'
];

export default function getFirstNonEmptyCharPos(
	text: string,
	firstPos: number
): number {
	let index = firstPos;
	while (true) {
		const char = text[index];
		if (!EMPTY_CHARS.includes(char)) {
			return index;
		}
		if (index >= text.length) {
			return index;
		}
		index++;
	}
}
