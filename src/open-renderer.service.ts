import { Injectable } from '@angular/core';
import { merge } from 'rxjs';

import ProjectFilesService from './project-files.service';
import FocusComponentService from './focus-component.service';

const URL = 'renderer';
const TIMEOUT_MS = 1000;

@Injectable({ providedIn: 'root' })
export default class OpenRendererService {

	constructor(
		private readonly _focusComponentService: FocusComponentService,
		private readonly _ngProjectFilesService: ProjectFilesService
	) { }

	open(): void {
		const rendererPage = window.open(`/${URL}`);
		if (rendererPage === null) {
			return;
		}
		const pageWrapper = new PageWrapper(rendererPage);
		setTimeout(
			() => {
				this.sendData(pageWrapper);
				merge(
					this._ngProjectFilesService.change$,
					this._focusComponentService.focusComponentChange$
				).subscribe(() => {
					this.sendData(pageWrapper);
				});
			},
			TIMEOUT_MS
		);
	}

	private sendData(pageWrapper: PageWrapper): void {
		const data = this.getData();
		pageWrapper.sendMessageToWindow(data);
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
