import {
	Component,
	Input
} from '@angular/core';

@Component({
	selector: 'wp-title',
	standalone: true,
	templateUrl: './title.component.html',
	styleUrls: ['./title.component.scss']
})
export default class TitleComponent {
	@Input() title!: string;
}
