type ImportClause = string | IDefaultImport | (string | ImportAlias)[];

export default ImportClause;

interface ImportAlias {
	propertyName: string;
	name: string;
}

interface IDefaultImport {
	defaultImport: string;
}
