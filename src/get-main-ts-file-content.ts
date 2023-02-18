import { ICode, IDeclaration, IPosition } from './ts-file.interface';

export default function getMainContent(
	mainSourceCode: ICode,
	fileContent: string,
	transform = (text: string) => text
): string {
	const declarationStringList = mainSourceCode.declarations.map(declaration => {
		let declarationText = declaration.text;
		if (isExported(
			declaration,
			mainSourceCode
		)) {
			declarationText = declarationText.substring(
				0,
				declaration.declarationStart
			) + 'export ' + declarationText.substring(declaration.declarationStart);
		}
		declarationText = transform(declarationText);
		return declarationText;
	});
	return declarationStringList.join('\n');
}

function isExported(
	declaration: IDeclaration,
	mainSourceCode: ICode
): boolean {
	const name = declaration.name;
	if (mainSourceCode.defaultExportName === name) {
		return true;
	}
	return mainSourceCode.exports.some(e => {
		if (e.propertyName !== undefined) {
			return e.propertyName === name;
		}
		return e.name === name;
	});
}
