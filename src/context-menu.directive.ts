import {
	Directive,
	ElementRef,
	HostListener,
	Input,
	TemplateRef
} from '@angular/core';
import {
	filter,
	fromEvent,
	map,
	Observable,
	Subscription,
	take
} from 'rxjs';

import CreateComponentInBodyService from './create-component-in-body.service';
import IOverlayRef from './i-overlay-ref';
import OverlayContainerComponent from './overlay-container.component';

@Directive({
	selector: '[wp-context-menu]',
	standalone: true
})
export default class ContextMenuDirective {
	@Input() contextMenuTemplate!: TemplateRef<any>;
	@Input() contextMenuInput: any;

	private _sub?: Subscription;
	private _overlayRef?: IOverlayRef<OverlayContainerComponent>;

	constructor(
		private readonly _createComponentInBodyService: CreateComponentInBodyService,
		elementRef: ElementRef
	) {
		elementRef.nativeElement.oncontextmenu = () => false;
	}

	@HostListener(
		'contextmenu',
		['$event']
	)
	onContextMenu({ x, y }: MouseEvent): void {
		this.open(
			{
				x,
				y
			} as MouseEvent
		);
	}

	open({ x, y }: MouseEvent): void {
		this.close();
		this._overlayRef = this._createComponentInBodyService.appendComponentToBody(OverlayContainerComponent);
		const componentRef = this._overlayRef.componentRef;
		componentRef.instance.position = { x, y };
		componentRef.instance.setOverlayContentTemplate(
			this.contextMenuTemplate,
			{
				$implicit: this.contextMenuInput
			}
		);
		this._sub = listenClickOutside(this._overlayRef).subscribe(() => {
			this.close();
		});
	}

	close(): void {
		if (this._overlayRef === undefined) {
			return;
		}
		this._sub?.unsubscribe();
		this._overlayRef?.destroy();
		this._overlayRef = undefined;
	}
}

function listenClickOutside(overlayRef: IOverlayRef<OverlayContainerComponent>): Observable<void> {
	return fromEvent<MouseEvent>(
		document,
		'click'
	).pipe(
		filter(event => {
			const clickTargetHtml = event.target as HTMLElement;
			const contentElementRef = overlayRef.componentRef.instance.contentElementRef;
			const contentHtmlElement = contentElementRef.nativeElement as HTMLElement;
			return !contentHtmlElement.contains(clickTargetHtml);
		}),
		take(1),
		map(e => undefined)
	);
}
