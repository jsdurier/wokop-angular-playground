export default interface IProjectFilesService {
	/**
	 * @param fileName no extension (.ts is implicit).
	 */
	getFile(fileName: string): string | undefined;
}
