import {
	Injectable,
	Injector,
	ComponentFactoryResolver,
	EmbeddedViewRef,
	ApplicationRef,
	Type
} from '@angular/core';

import IOverlayRef from './i-overlay-ref';

@Injectable({ providedIn: 'root' })
export default class CreateComponentInBodyService {
	constructor(
		private _componentFactoryResolver: ComponentFactoryResolver,
		private _appRef: ApplicationRef,
		private _injector: Injector
	) { }

	appendComponentToBody<T>(component: Type<T>): IOverlayRef<T> {
		const componentRef = this._componentFactoryResolver
			.resolveComponentFactory(component)
			.create(this._injector);
		this._appRef.attachView(componentRef.hostView);
		const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
			.rootNodes[0] as HTMLElement;
		document.body.appendChild(domElem);
		return {
			destroy: () => {
				this._appRef.detachView(componentRef.hostView);
				componentRef.destroy();
			},
			componentRef
		};
	}
}
