import importNgComponentInFile from './import-ng-component-in-file';

const FILE_CONTENT = `import { Component } from '@angular/core';

@Component({
  selector: 'wp-toto',
  standalone: true
})
export default class TotoComponent {
  
}
`;

main();

function main(): void {
	const res = importNgComponentInFile(
		FILE_CONTENT,
		{
			className: 'ZozoComponent',
			fileName: 'zozo.component'
		}
	);
	console.log(res);
}
