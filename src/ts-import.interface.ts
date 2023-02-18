import ImportClause from './import-clause';

export default interface ITsImport {
	importClause: ImportClause;
	moduleSpecifier: string;
	tokenPosition: {
		start: any;
		end: any;
	};
}
