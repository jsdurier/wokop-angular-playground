import importNgServiceInFile from './import-ng-service-in-file';

const FILE_CONTENT = `import { Component } from '@angular/core';

import ToolbarComponent from './toolbar.component';

@Component({
  selector: 'wp-example',
  standalone: true,
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  imports: [
    ToolbarComponent
  ]
})
export default class ExampleComponent {
  constructor(
    private readonly _totoService: TotoService
  ) { }
}
`;

main();

function main() {
	const res = importNgServiceInFile(
		FILE_CONTENT,
		{
			className: 'TitiService',
			fileName: 'titi.service'
		}
	);
	console.log(res);
}
