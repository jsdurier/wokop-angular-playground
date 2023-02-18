import bundleFiles from './bundle-files';

const ngComponentFileName = 'app.component.ts';
const FILES = {
	'app.component.ts': `import { Component } from '@angular/core';

import { IToto } from './i-toto';
import TotoComponent from './toto.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export default class AppComponent { }
`,
	'toto.ts': `import titi from './titi';
import tata from './tata';
`,
	'tata.ts': `import tutu from './tutu';
import titi from './titi';
`,
	'app.component.html': '',
	'app.component.scss': '',
	'titi.ts': `import tutu from './tutu';
`,
	'tutu.ts': ``,
	'i-toto.ts': `export interface IToto {
	tata: ITata;
}

interface ITata { }
`,
	'toto.component.ts': `import { Component } from '@angular/core';
	
@Component({
	selector: 'toto',
	templateUrl: './toto.component.html',
	styleUrls: ['./toto.component.scss']
})
export default class TotoComponent { }`,
	'toto.component.html': ``,
	'toto.component.scss': ``
};
const ngProjectFilesService = {
	getFile(fileName: string) {
		return (FILES as any)[fileName];
	}
}

const res = bundleFiles(
	ngComponentFileName,
	ngProjectFilesService
);

console.log(res);
