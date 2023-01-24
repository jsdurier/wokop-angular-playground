import {
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

import ClickableElementComponent from './clickable-element.component';

@Component({
	selector: 'wp-tab-title',
	standalone: true,
	imports: [
		FlexLayoutModule,
		FontAwesomeModule,
		ClickableElementComponent
	],
	templateUrl: './tab-title.component.html',
	styleUrls: ['./tab-title.component.scss']
})
export default class TabTitleComponent {
	@Input() title!: string;
	@Input() selected: boolean | undefined = false;

	@Output() close = new EventEmitter<void>();

	closeIcon = icons.faClose;

	onClose(): void {
		this.close.next();
	}
}
