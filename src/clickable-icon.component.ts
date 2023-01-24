import {
	Component,
	Input
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
	selector: 'wp-clickable-icon',
	standalone: true,
	imports: [
		FlexLayoutModule
	],
	templateUrl: './clickable-icon.component.html',
	styleUrls: ['./clickable-icon.component.scss']
})
export default class ClickableIconComponent {
	@Input() icon!: string;
}
