export default function getHtmlElement(
	parentHtml: HTMLElement,
	selector: string
): HTMLElement | undefined {
	const list = selector.split('>');
	const newList = list.map(e => e.trim()).filter(e => e !== '');
	return getHtmlElement2(
		parentHtml,
		newList
	);
}

function getHtmlElement2(
	parentHtml: HTMLElement,
	selectorList: string[]
): HTMLElement | undefined {
	if (selectorList.length === 0) {
		return parentHtml;
	}
	const selector = selectorList[0];
	const child = findChild(
		parentHtml,
		selector
	);
	if (!child) {
		return undefined;
	}
	return getHtmlElement2(
		child,
		selectorList.slice(1)
	);
}

function findChild(
	parentHtml: HTMLElement,
	selector: string
): HTMLElement | undefined {
	const children = Array.from(parentHtml.children);
	const range = getElementRange(selector);
	if (range !== undefined) {
		const a = children.filter(e => match(
			e as HTMLElement,
			range.tag
		));
		return a[range.index] as HTMLElement;
	}
	return children.find(e => match(
		e as HTMLElement,
		selector
	)) as HTMLElement;
}

function match(
	element: HTMLElement,
	selector: string
): boolean {
	const list = selector.split('.');
	if (list.length !== 2) {
		return element.localName === selector;
	}
	const tag = list[0];
	const className = list[1];
	return element.localName === tag &&
		element.className === className;
}

interface IElementRange {
	tag: string;
	index: number;
}

function getElementRange(selector: string): IElementRange | undefined {
	const a = selector.split(':nth-child(');
	if (a.length !== 2) {
		return undefined;
	}
	const index = Number(a[1].slice(0, a[1].indexOf(')')));
	return {
		tag: a[0],
		index: index - 1
	};
}
