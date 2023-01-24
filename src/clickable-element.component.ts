import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
	selector: 'wp-clickable-element',
	standalone: true,
	imports: [
		FlexLayoutModule
	],
	templateUrl: './clickable-element.component.html',
	styleUrls: ['./clickable-element.component.scss']
})
export default class ClickableElementComponent { }
