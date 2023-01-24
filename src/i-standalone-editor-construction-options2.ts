import * as monaco from 'monaco-editor';

import IEditorModel from './i-editor-model';

export default interface IStandaloneEditorConstructionOptions2 extends Omit<monaco.editor.IStandaloneEditorConstructionOptions, 'model'> {
	model: IEditorModel;
}
