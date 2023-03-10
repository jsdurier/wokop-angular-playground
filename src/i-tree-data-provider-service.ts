import { Observable } from 'rxjs';

export default abstract class ITreeDataProviderService<T> {
	abstract getRootNodes(): Promise<T[]>;
	abstract getChildren(node: T): Promise<T[]>;
	abstract readonly change$: Observable<void>;
}
