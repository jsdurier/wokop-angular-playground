import bundleTsFile from './bundle-ts-files';
import { isAngularComponent } from './is-angular-component';
import IProjectFilesService from './project-files.interface';
import replaceTemplateAndStylesUrl from './replace-template-and-styles-url';

/**
 * @param fileName with .ts extension
 */
export default function bundleAngularComponent(
	fileName: string,
	projectFilesService: IProjectFilesService
): string {
	const a: IProjectFilesService = {
		getFile(fileName) {
			return projectFilesService.getFile(fileName + '.ts');
		},
	};
	const transform = (text: string) => {
		if (!isAngularComponent(text)) {
			return text;
		}
		return replaceTemplateAndStylesUrl(
			text,
			projectFilesService
		);
	};
	return bundleTsFile(
		getFileName(fileName),
		a,
		transform
	);
}

function getFileName(filePath: string): string {
	const a = filePath.split('.');
	a.pop();
	return a.join('.');
}
