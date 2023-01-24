import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, TemplateRef } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import TabComponent from './tab.component';
import TabTitleComponent from './tab-title.component';

interface ITab {
	title: string;
	selected: boolean;
}

@Component({
	selector: 'wp-tabs',
	standalone: true,
	imports: [
		FlexLayoutModule,
		TabTitleComponent,
		TabComponent,
		CommonModule
	],
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss']
})
export default class TabsComponent implements AfterContentInit {
	public isInit = false;

	@ContentChildren(TabComponent) tabComponents: TabComponent[] = [];

	ngAfterContentInit(): void {
		/**
		 * We wait tab components inside have their templateRef
		 * ready.
		 */
		setTimeout(() => {
			this.isInit = true;
		});
	}

	get tabs(): TabComponent[] {
		return Array.from(this.tabComponents);
	}

	get selectedTab(): TabComponent | undefined {
		const res = this.tabComponents.find(e => e.selected);
		return res;
	}

	onTabClick(tabComponent: TabComponent): void {
		this.tabComponents.forEach(e => {
			e.selected = false;
		});
		tabComponent.selected = true;
		/**
		 * TODO propager l'évenement en dehors
		 * du composant
		 */
	}
}
