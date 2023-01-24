import {
	Injectable,
	ViewContainerRef
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export default class VscodeWorkspaceViewContainerRefService {
	container?: ViewContainerRef;
}
