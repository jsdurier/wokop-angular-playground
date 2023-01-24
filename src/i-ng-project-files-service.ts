import { Observable } from 'rxjs';

export default abstract class INgProjectFilesService {
	abstract getFile(fileName: string): string | undefined;
	abstract change$: Observable<void>;
}
