import {
	ChangeDetectorRef,
	Component,
	Input,
	Type,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import waitDelay from './wait-delay';

const DELAY_MS = 4000;

@Component({
	selector: 'wp-reloader',
	standalone: true,
	templateUrl: './reloader.component.html',
	styleUrls: ['./reloader.component.scss']
})
export default class ReloaderComponent {
	@ViewChild(
		'container',
		{ read: ViewContainerRef }
	) container!: ViewContainerRef;
	@Input() component!: Type<any>;

	constructor(private readonly _cd: ChangeDetectorRef) { }

	ngAfterViewInit(): void {
		this.createComponent();
		this._cd.detectChanges();
	}

	private createComponent() {
		const componentRef = this.container.createComponent(this.component);
		componentRef.instance.close$.subscribe(async () => {
			await waitDelay(DELAY_MS);
			this.container.clear();
			this.createComponent();
		});
	}
}
