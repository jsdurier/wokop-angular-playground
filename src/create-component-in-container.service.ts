import {
	Injectable,
	Type,
	ViewContainerRef,
	ComponentRef
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export default class CreateComponentInContainerService {
	appendComponentToContainer<T>(
		container: ViewContainerRef,
		component: Type<T>
	): ComponentRef<T> {
		const componentRef = container.createComponent(
			component,
			// {
			// 	injector: this._injector
			// }
		);
		return componentRef;
		// const componentRef = this._componentFactoryResolver
		// 	.resolveComponentFactory(component)
		// 	.create(this._injector);
		// this._appRef.attachView(componentRef.hostView);
		// const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
		// 	.rootNodes[0] as HTMLElement;
		// document.body.appendChild(domElem);
		// return {
		// 	destroy: () => {
		// 		// this._appRef.detachView(componentRef.hostView);
		// 		componentRef.destroy();
		// 	},
		// 	componentRef
		// };
	}
}
