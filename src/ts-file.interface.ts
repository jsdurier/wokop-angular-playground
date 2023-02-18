import * as ts from 'typescript';

export interface ICode {
	declarations: IDeclaration[];
	exports: IExport[];
	defaultExportName?: string;
}

export interface IDeclaration {
	name: string;
	text: string;
	declarationStart: number;
	// position: IPosition;
	kind: ts.SyntaxKind;
}

export interface IPosition {
	start: number;
	end: number;
}

export interface IExport {
	propertyName?: string;
	name: string;
}
