import {
	Component,
	ElementRef,
	ViewChild,
	ViewContainerRef
} from '@angular/core';

import ContainerService from './container.service';
import ShowOverlayService from './show-overlay.service';

@Component({
	selector: 'wp-container',
	standalone: true,
	templateUrl: './container.component.html',
	styleUrls: ['./container.component.scss'],
	providers: [
		ContainerService,
		ShowOverlayService
	]
})
export default class ContainerComponent {
	// @ViewChild('container') container!: ElementRef;
	@ViewChild(
		'container',
		{ read: ViewContainerRef }
	) container!: ViewContainerRef;

	constructor(
		private readonly _containerService: ContainerService,
		private readonly _showOverlayService: ShowOverlayService
	) {
		_showOverlayService.toto = 2;
	}

	ngAfterViewInit(): void {
		const element = this.container.element;
		this._containerService.init(element);
		/**
		 * TODO
		 * container à définir par VscodeWorkspaceComponent.
		 */
		this._showOverlayService.container = this.container;
	}
}
