import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import CompileComponentComponent from './compile-component.component';
import OpenRendererService from './open-renderer.service';

@Component({
	selector: 'wp-renderer-panel',
	standalone: true,
	templateUrl: './renderer-panel.component.html',
	styleUrls: ['./renderer-panel.component.scss'],
	imports: [
		CommonModule,
		CompileComponentComponent
	]
})
export default class RendererPanelComponent {
	isOpenInNewWindow = false;

  constructor(
    private readonly _openRendererService: OpenRendererService
  ) { }

	showInNewWindow(): void {
		this.isOpenInNewWindow = true;
		this._openRendererService.open();
	}

	expandPanel(): void {
		this.isOpenInNewWindow = false;
	}
}
