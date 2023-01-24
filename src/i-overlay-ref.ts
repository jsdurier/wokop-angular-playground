import { ComponentRef } from '@angular/core';

export default interface IOverlayRef<T> {
	destroy(): void;
	componentRef: ComponentRef<T>;
}
