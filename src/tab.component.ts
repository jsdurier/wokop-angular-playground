import {
	Component,
	ContentChild,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from '@angular/core';

@Component({
	selector: 'wp-tab',
	standalone: true,
	templateUrl: './tab.component.html',
	styleUrls: ['./tab.component.scss']
})
export default class TabComponent {
	@Input() title!: string;
	@Input() selected: boolean | undefined = false;

	@Output() close = new EventEmitter<void>();

	@ContentChild(TemplateRef) templateRef!: TemplateRef<any>;
}
