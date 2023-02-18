import bundleAngularComponent from '../src/bundle-angular-component';
import IFileNameRecord from '../src/file-name-record.interface';

const FILES: IFileNameRecord<string> = {
	'toto.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'toto',
	templateUrl: './toto.component.html',
	styleUrls: ['./toto.component.scss']
})
export default class TotoComponent {

}`,
	'toto.component.html': '<div>toto</div>',
	'toto.component.scss': ''
};

const res = bundleAngularComponent(
	'toto.component',
	{
		getFile(fileName) {
			return FILES[fileName];
		}
	}
);

console.log(res);
