import * as ts from 'typescript';

import { ITsImport } from './get-ts-imports-from-node';

export default interface ITsFile {
	otherStatements: ts.Statement[];
	imports: ITsImport[];
	fileContent: string;
}
