import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import ContextMenuDirective from './context-menu.directive';

const USERS = [
	{
		name: 'tom'
	},
	{
		name: 'paul'
	}
];

@Component({
	selector: 'wp-context-menu-2',
	standalone: true,
	imports: [
		CommonModule,
		// OverlayModule,
		ContextMenuDirective
	],
	templateUrl: './context-menu.component.html',
	styleUrls: ['./context-menu.component.scss']
})
export default class ContextMenuComponent {
	users = USERS;

	delete(user: any): void {
		// this.close(); // TODO
	}
}
