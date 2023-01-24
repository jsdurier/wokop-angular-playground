import { Injectable } from '@angular/core';

import INgProjectFilesService from './i-ng-project-files-service';

@Injectable({ providedIn: 'root' })
export default class NgProjectFilesDebugService implements INgProjectFilesService {
	getFile(fileName: string): string | undefined {
		return (FILES as any)[fileName];
	}
}

const FILES = {
	'toto.component.ts': `import { Component } from '@angular/core';
import { Subject } from 'rxjs';

import TataComponent from './tata.component';
import TITI from './titi';

@Component({
	selector: 'toto',
	templateUrl: './toto.component.html',
	styleUrls: ['./toto.component.scss']
	standalone: true,
	imports: [
		TataComponent
	]
})
export default class TotoComponent {
	titi = 1;
	tutu = TITI;

	constructor() {
		setInterval(() => {
			this.titi += 1;
		},1000);
	}
}`,
	'tata.component.ts': `import { Component } from '@angular/core';

import TITI from './titi';

@Component({
	selector: 'tata',
	templateUrl: './tata.component.html',
	standalone: true
})
export default class TataComponent {
	titi = TITI;
}`,
	'titi.ts': `const TITI = 'titi constant'
export default TITI;`,
	'toto.component.html': `<p>I am toto component : {{titi}}</p><tata></tata>{{tutu}}`,
	'toto.component.scss': `p {
	color: red;
}`,
	'tata.component.html': `<p>I am tata component: {{titi}}</p>`,
};
