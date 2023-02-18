import * as ts from 'typescript';

export default function parseTsFile(fileContent: string): ts.SourceFile {
	return ts.createSourceFile(
		'fileName',
		fileContent,
		ts.ScriptTarget.Latest
	);	
}
