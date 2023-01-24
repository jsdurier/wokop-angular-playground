import { Injectable } from '@angular/core';

import IFileInEditor from './i-file-in-editor';

@Injectable({ providedIn: 'root' })
export default class FilesInEditorService {
	files: IFileInEditor[] = [];

	open(filePath: string): void {
		this.files.forEach(e => e.selected = false);
		const file = this.files.find(e => e.filePath === filePath);
		if (file !== undefined) {
			file.selected = true;
			return;
		}
		this.files.push({
			filePath,
			selected: true
		});
	}

	close(filePath: string): void {
		this.files = this.files.filter(e => e.filePath !== filePath);
	}
}
