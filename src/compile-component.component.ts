import { CommonModule } from '@angular/common';
import {
	Component,
	Injectable,
	Input,
	OnChanges
} from '@angular/core';
import { debounceTime } from 'rxjs';

import createNgComponentFromString from './create-ng-component-from-string';
import INgProjectFilesService from './i-ng-project-files-service';

const DEBOUNCE_MS = 250;

/**
 * To use this component, you should have this line
 * in main.ts file :
 * import '@angular/compiler';
 */
@Component({
	selector: 'wp-compile-component',
	standalone: true,
	templateUrl: './compile-component.component.html',
	styleUrls: ['./compile-component.component.scss'],
	imports: [
		CommonModule
	]
})
@Injectable()
export default class CompileComponentComponent implements OnChanges {
	@Input() ngComponentFileName!: string;

	dynamicComponent: any;

	constructor(
		private readonly _ngProjectFilesService: INgProjectFilesService
	) {
		this.listenChanges();
	}

	get renderComponent(): boolean {
		return this.dynamicComponent !== undefined;
	}

	ngOnChanges() {
		this.update();
	}

	private update(): void {
		this.dynamicComponent = createNgComponentFromString(
			this.ngComponentFileName,
			this._ngProjectFilesService
		);
	}

	private listenChanges(): void {
		/**
		 * TODO
		 */
		this._ngProjectFilesService.change$.pipe(debounceTime(DEBOUNCE_MS)).subscribe(() => {
			this.update();
		});
	}
}
