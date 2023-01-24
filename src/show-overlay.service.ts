import { ComponentType } from '@angular/cdk/portal';
import {
	ComponentRef,
	Injectable,
	Injector,
	ViewContainerRef
} from '@angular/core';

// import CreateComponentInContainerService from './create-component-in-container.service';
// import CreateComponentInBodyService from './create-component-in-body.service';
import IOverlayRef from './i-overlay-ref-2';
import IPositionInOverlay, { Axis } from './i-position-in-overlay';
import OverlayContainerComponent from './overlay-container.component';

@Injectable({ providedIn: 'root' })
export default class ShowOverlayService {
	toto = 1;
	container?: ViewContainerRef;

	constructor(
		// private readonly _createComponentInBodyService: CreateComponentInBodyService
	) { }

	async showOverlay<T>(
		container: ViewContainerRef,
		componentClass: ComponentType<T>,
		position: IPositionInOverlay
	): Promise<IOverlayRef<T>> {
		const containerRef = container.createComponent(OverlayContainerComponent);
		// const overlayRef = this._createComponentInBodyService.appendComponentToBody(OverlayContainerComponent);
		// const containerRef = overlayRef.componentRef;
		// const injector = Injector.create([
		// 	{
		// 		provide: ContextMenuRef,
		// 		useValue: {
		// 			close: () => {
		// 				this.close();
		// 			}
		// 		}
		// 	}
		// ]);
		const overlayContainerComponent = containerRef.instance;
		overlayContainerComponent.position = position;
		const componentRef = await overlayContainerComponent.setOverlayContentComponent(
			componentClass,
			// { filePath: this.filePath },
			// injector
		);
		return {
			componentRef,
			destroy: () => {
				containerRef.destroy()
			}
		};
	}

	showOverlay2<T>(
		componentClass: ComponentType<T>,
		position: IPositionInOverlay,
		inputs?: Partial<T>,
		injector?: Injector
	): ComponentRef<OverlayContainerComponent> {
		/**
		 * TODO
		 */
		if (this.container === undefined) {
			throw new Error(); // TODO
		}
		return this.showOverlay3(
			this.container,
			componentClass,
			position,
			inputs,
			injector
		);
	}

	showOverlay3<T>(
		container: ViewContainerRef,
		componentClass: ComponentType<T>,
		windowPosition: IPositionInOverlay,
		inputs?: Partial<T>,
		injector?: Injector
	): ComponentRef<OverlayContainerComponent> {
		const position = convertPosition(
			windowPosition,
			container.element.nativeElement as HTMLElement
		);
		const containerRef = container.createComponent(OverlayContainerComponent);
		const overlayContainerComponent = containerRef.instance;
		overlayContainerComponent.position = position;
		overlayContainerComponent.setOverlayContentComponent(
			componentClass,
			inputs,
			injector
		);
		return containerRef;
	}

	showOverlay4<T>(
		container: ViewContainerRef,
		componentClass: ComponentType<T>,
		windowPosition: IPositionInOverlay,
		inputs?: Partial<T>,
		injector?: Injector
	): ComponentRef<OverlayContainerComponent> {
		const containerRef = container.createComponent(OverlayContainerComponent);
		const overlayContainerComponent = containerRef.instance;
		overlayContainerComponent.position = windowPosition;
		overlayContainerComponent.setOverlayContentComponent(
			componentClass,
			inputs,
			injector
		);
		return containerRef;
	}

	// private get container(): ViewContainerRef {
	// 	/**
	// 	 * TODO-101
	// 	 * A récupérer depuis un service
	// 	 */
	// 	throw new Error('container');
	// }
}

function convertPosition(
	windowPosition: IPositionInOverlay,
	relativeHtmlElement: HTMLElement
): IPositionInOverlay {
	const rect = relativeHtmlElement.getBoundingClientRect();
	return {
		x: convertAxisValue(
			windowPosition.x,
			rect.x
		),
		y: convertAxisValue(
			windowPosition.y,
			rect.y
		)
	};
}

function convertAxisValue(
	axis: Axis,
	relativeValue: number
): Axis {
	if (typeof axis !== 'number') {
		return axis;
	}
	return axis - relativeValue;
}
