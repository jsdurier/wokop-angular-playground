import IFile from './i-file';

const FILE_LIST: IFile[] = [
	{
		path: 'main.ts',
		content: `import { bootstrapApplication } from '@angular/platform-browser';

import AppComponent from './app.component';

bootstrapApplication(AppComponent);
`
	},
	{
		path: 'app.component.ts',
		content: `import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export default class AppComponent {

}
`
	},
	{
		path: 'app.component.html',
		content: '<p>Hello world</p>'
	},
	{
		path: 'app.component.scss',
		content: ''
	},
// 	{
// 		path: 'toto.component.ts',
// 		content: `import { Component } from '@angular/core';

// @Component({
// 	selector: 'wp-toto',
// 	templateUrl: './toto.component.html',
// 	styleUrls: ['./toto.component.scss']
// })
// export default class TotoComponent {

// }
// `
// 	},
	// {
	// 	path: 'toto.component.html',
	// 	content: '<p>toto component works</p>'
	// },
	// {
	// 	path: 'toto.component.scss',
	// 	content: ''
	// }
];

export default FILE_LIST;
