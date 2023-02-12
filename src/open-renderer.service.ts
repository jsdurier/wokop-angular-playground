import { Injectable } from '@angular/core';
import { merge } from 'rxjs';

import ProjectFilesService from './project-files.service';
import FocusComponentService from './focus-component.service';

const URL = 'renderer';
const TIMEOUT_MS = 1000;

@Injectable({ providedIn: 'root' })
export default class OpenRendererService {
	private _pageWrapper?: PageWrapper;

	constructor(
		private readonly _focusComponentService: FocusComponentService,
		private readonly _ngProjectFilesService: ProjectFilesService
	) { }

	ngOnDestroy(): void {
		this._pageWrapper?.close();
	}

	open(): void {
		const rendererPage = window.open(`/${URL}`);
		if (rendererPage === null) {
			return;
		}
		this._pageWrapper = new PageWrapper(rendererPage);
		setTimeout(
			() => {
				this.sendData();
				merge(
					this._ngProjectFilesService.change$,
					this._focusComponentService.focusComponentChange$
				).subscribe(() => {
					this.sendData();
				});
			},
			TIMEOUT_MS
		);
	}

	private sendData(): void {
		const data = this.getData();
		this._pageWrapper?.sendMessageToWindow(data);
	}

	private getData() {
		const files = this._ngProjectFilesService.filePathList;
		const focusComponent = this._focusComponentService.focusComponent;
		return {
			files,
			focusComponent
		};
	}
}

class PageWrapper {
	constructor(
		private readonly _page: Window
	) { }

	close(): void {
		this._page.close();
	}

	sendMessageToWindow(message: any): void {
		this._page.postMessage(
			message,
			'*'
		);
	}
}
