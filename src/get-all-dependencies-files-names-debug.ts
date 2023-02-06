import getAllDepedenciesFilesNames from './get-all-dependencies-files-names';

const FILES = {
	'toto.ts': `import titi from './titi';
import tata from './tata';
`,
	'tata.ts': `import tutu from './tutu';
import titi from './titi';
`,
	'titi.ts': `import tutu from './tutu';
`,
	'tutu.ts': ``
};

const ngProjectFilesService = {
	getFile(fileName: string) {
		return (FILES as any)[fileName];
	}
}

const res = getAllDepedenciesFilesNames(
	'toto.ts',
	ngProjectFilesService
);

console.log(res);
