import * as ts from 'typescript';

import {
	getTsImportsFromNode,
	ITsImport
} from './get-ts-imports-from-node';

export function getTsImports(fileContent: string): ITsImport[] {
	const node = ts.createSourceFile(
		'fileName',
		fileContent,
		ts.ScriptTarget.Latest
	);
	return getTsImportsFromNode(node);
}

export { ITsImport };
