import { Injectable } from '@angular/core';

import ProjectFilesService from './project-files.service';
import FILE_LIST from './projects-files-mock';

@Injectable({ providedIn: 'root' })
export default class ProjectTreeMockInitService {
	constructor(
		projectFilesService: ProjectFilesService
	) {
		projectFilesService.filePathList = FILE_LIST;
	}
}
