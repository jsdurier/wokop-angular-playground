import { ComponentRef } from '@angular/core';

export default interface IOverlayRef<T> {
	componentRef: ComponentRef<T>;
	destroy(): void;
}
