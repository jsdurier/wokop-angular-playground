import * as angularCore from '@angular/core';

import transpileTs from "./transpile-ts";

const AngularCore = angularCore;

const bundle = `namespace Tata_component {
	const Component = AngularCore.Component;

@Component({
	selector: 'wp-tata',
	template: '<div>tata !!!</div>',
	styles: [\`:host > div {
	background-color: yellow;
}\`]
})
export class DefaultExport__ { }
 
}
Tata_component.DefaultExport__`;

const jsCode = transpileTs(bundle);
const jsClass = eval(jsCode);

console.log(jsClass);
