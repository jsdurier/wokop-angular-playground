import * as ts from 'typescript';

const DEFAULT_OPTIONS: ts.TranspileOptions = {
	compilerOptions: {
		module: ts.ModuleKind.CommonJS,
		experimentalDecorators: true,
		emitDecoratorMetadata: true
	}
};

export default function transpileTs(
	source: string,
	options?: ts.TranspileOptions
): string {
	/**
	 * Default options -- you could also perform a merge,
	 * or use the project tsconfig.json
	 */
	if (options === undefined) {
		options = DEFAULT_OPTIONS;
	}
	return ts.transpileModule(
		source,
		options
	).outputText;
}
