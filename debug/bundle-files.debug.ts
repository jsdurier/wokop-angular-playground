import bundleTsFile from '../src/bundle-ts-files';
import IFileNameRecord from '../src/file-name-record.interface';

console.log('\n\n****************************************************************');
console.log('****************************************************************');
console.log('****************************************************************\n\n');

const FILES: IFileNameRecord<string> = {
	'tutu': `export default function tutu() {
		return 'tutu';
}`,
	'toto': `import tutu from './tutu';

export default class Toto {
	private _titi: string;

	constructor() {
		this._titi = tutu() + ' hey';
	}
}`
}

const res = bundleTsFile(
	'toto',
	{
		getFile(fileName) {
			return FILES[fileName]
		}
	}
);
console.log(res);
