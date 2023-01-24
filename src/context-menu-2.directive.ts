import {
	ComponentRef,
	Directive,
	ElementRef,
	HostListener,
	Injector,
	Input
} from '@angular/core';
import {
	filter,
	fromEvent,
	map,
	Observable,
	Subscription,
	take
} from 'rxjs';

import ContextMenuRef from './context-menu-ref.service';
import FileContextMenuComponent from './file-context-menu.component';
import OverlayContainerComponent from './overlay-container.component';
import ShowOverlayService from './show-overlay.service';

@Directive({
	selector: '[wp-context-menu-2]',
	standalone: true
})
export default class ContextMenu2Directive {
	// @Input() contextMenuTemplate!: TemplateRef<any>;
	// @Input() contextMenuInput: any;
	@Input() filePath!: string;

	private _sub?: Subscription;
	private _overlayRef?: ComponentRef<OverlayContainerComponent>;

	constructor(
		private readonly _showOverlayService: ShowOverlayService,
		private readonly _injector: Injector,
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
		const injector = Injector.create(
			[
				{
					provide: ContextMenuRef,
					useValue: {
						close: () => {
							this.close();
						}
					}
				}
			],
			this._injector
		);
		this._overlayRef = this._showOverlayService.showOverlay2(
			FileContextMenuComponent,
			{
				x,
				y
			},
			{ filePath: this.filePath },
			injector
		);
		const containerHtml = this._showOverlayService.container!.element.nativeElement as HTMLElement;
		if (containerHtml.style.pointerEvents === 'none') {
			return;
		}
		this._sub = listenClickOutside(
			this._overlayRef,
		).subscribe(() => {
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

function listenClickOutside(
	overlayRef: ComponentRef<OverlayContainerComponent>
): Observable<void> {
	return fromEvent<MouseEvent>(
		document,
		'click'
	).pipe(
		filter(event => {
			const clickTargetHtml = event.target as HTMLElement;
			const contentElementRef = overlayRef.instance.contentElementRef;
			const contentHtmlElement = contentElementRef.nativeElement as HTMLElement;
			return !contentHtmlElement.contains(clickTargetHtml);
		}),
		take(1),
		map(e => undefined)
	);
}
