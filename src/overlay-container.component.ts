import { ComponentType } from '@angular/cdk/overlay';
import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentRef,
	ElementRef,
	Injector,
	TemplateRef,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import ContextMenuRef from './context-menu-ref.service';

import IPositionInOverlay, { Axis } from './i-position-in-overlay';

@Component({
	selector: 'wp-overlay-container',
	standalone: true,
	templateUrl: './overlay-container.component.html',
	styleUrls: ['./overlay-container.component.scss']
})
export default class OverlayContainerComponent implements AfterViewInit {
	private _isViewInit = false;
	private _template?: TemplateRef<any>;
	private _context?: any;
	private _componentClass?: ComponentType<any>;
	private _inputs?: any;
	private _injector?: Injector;
	private _componentRef$ = new Subject<ComponentRef<any>>();

	@ViewChild(
		'content',
		{ read: ViewContainerRef }
	) content!: ViewContainerRef;

	@ViewChild('wrapper') contentElementRef!: ElementRef;

	position!: IPositionInOverlay;

	constructor(
		private readonly _cd: ChangeDetectorRef
	) { }

	ngAfterViewInit(): void {
		this._isViewInit = true;
		if (this._template !== undefined) {
			this.content.createEmbeddedView(
				this._template,
				this._context
			);
		} else if (this._componentClass !== undefined) {
			const componentRef = this.createComponent(
				this._componentClass,
				this._inputs,
				this._injector
			);
			this._componentRef$.next(componentRef);
		} else {
			return;
		}
		this._cd.detectChanges();
	}

	setOverlayContentTemplate(
		value: TemplateRef<any>,
		context: any
	): void {
		if (!this._isViewInit) {
			this._template = value;
			this._context = context;
			return;
		}
		this.content.createEmbeddedView(
			value,
			context
		);
	}

	async setOverlayContentComponent<T>(
		componentClass: ComponentType<T>,
		inputs: Partial<T> = {},
		injector?: Injector
	): Promise<ComponentRef<T>> {
		if (!this._isViewInit) {
			this._componentClass = componentClass;
			this._inputs = inputs;
			this._injector = injector;
			return firstValueFrom(this._componentRef$);
		}
		return this.createComponent(
			componentClass,
			inputs,
			injector
		);
	}

	get x(): string {
		return getAxis(this.position.x);
	}

	get y(): string {
		return getAxis(this.position.y);
	}

	get transform(): string {
		let res = '';
		if (this.position.x === 'center') {
			res += 'translateX(-50%)';
		}
		if (this.position.y === 'center') {
			res += 'translateY(-50%)';
		}
		return res;
	}

	private createComponent<T>(
		componentClass: ComponentType<T>,
		inputs: Partial<T> = {},
		injector?: Injector
	): ComponentRef<T> {
		const componentRef = this.content.createComponent(
			componentClass,
			{
				injector
			}
		);
		for (const inputName of Object.keys(inputs)) {
			(componentRef.instance as any)[inputName] = (inputs as any)[inputName];
		}
		return componentRef;
	}
}

function getAxis(axis: Axis): string {
	if (typeof axis === 'number') {
		return `${axis}px`;
	}
	if (axis === 'center') {
		return '50%';
	}
	return '';
}
