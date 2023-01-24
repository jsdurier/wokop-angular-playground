import {
	AfterViewInit,
	Component,
	ElementRef,
	ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	Observable,
	Subject
} from 'rxjs';

import IShowInputBox from './i-show-input-box';
import VscodeInputBoxValueService from './vscode-input-box-value.service';

@Component({
	selector: 'wp-vscode-input-box',
	standalone: true,
	imports: [
		FormsModule
	],
	templateUrl: './vscode-input-box.component.html',
	styleUrls: ['./vscode-input-box.component.scss']
})
export default class VscodeInputBoxComponent implements AfterViewInit {
	@ViewChild('input') input!: ElementRef;

	// value = '';
	description!: IShowInputBox;

	constructor(
		private readonly _vscodeInputBoxValueService: VscodeInputBoxValueService
	) { }

	ngAfterViewInit(): void {
		this.input.nativeElement.focus();
	}

	validate(): void {
		if (this.value === '') {
			return;
		}
		this._vscodeInputBoxValueService.validate();
	}

	escape(): void {
		this._vscodeInputBoxValueService.cancel();
	}

	get value(): string {
		return this._vscodeInputBoxValueService.value;
	}

	set value(value: string) {
		this._vscodeInputBoxValueService.value = value;
	}
}
