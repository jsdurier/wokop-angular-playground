import IProjectFilesService from './project-files.interface';

export default function replaceTemplateAndStylesUrl(
	fileContent: string,
	projectFilesService: IProjectFilesService
): string {
	let res = fileContent;
	res = replaceTemplateUrl(
		res,
		projectFilesService
	);
	res = replaceStyleUrls(
		res,
		projectFilesService
	);
	return res;
}

function replaceTemplateUrl(
	fileContent: string,
	projectFilesService: IProjectFilesService
): string {
	const a = fileContent.match(/templateUrl: '\.\/([\w\.-]+)'/);
	if (a === null) {
		return fileContent;
	}
	const templateUrl = a[1];
	const templateFileContent = projectFilesService.getFile(templateUrl);
	if (templateFileContent === undefined) {
		throw new Error(`no file ${templateUrl}`);
	}
	return fileContent.replace(
		a[0],
		`template: \`${templateFileContent}\``
	);
}

function replaceStyleUrls(
	fileContent: string,
	projectFilesService: IProjectFilesService
): string {
	/**
	 * TODO
	 * multiple scss files
	 */
	const a = fileContent.match(/styleUrls: \['\.\/([\w\.-]+)'\]/);
	if (a === null) {
		return fileContent;
	}
	const styleUrl = a[1];
	const styleFileContent = projectFilesService.getFile(styleUrl);
	if (styleFileContent === undefined) {
		throw new Error(`no file ${styleUrl}`);
	}
	return fileContent.replace(
		a[0],
		`styles: [\`${styleFileContent}\`]`
	);
}
