import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { CodeEditor } from '../../CodeEditor';
import formatXml from 'xml-formatter';
import { conf, language } from './geos_xml';

export default class MonacoCodeEditor extends CodeEditor {
	private monaco: typeof Monaco;
	private editor?: Monaco.editor.IStandaloneCodeEditor;

	private constructor(params: { monaco: typeof Monaco }) {
		super();
		this.monaco = params.monaco;
		// Register XML configuration
		this.monaco.languages.register({ id: 'geos_xml', extensions: ['.xml'] });
		this.monaco.languages.setLanguageConfiguration('geos_xml', conf);
		this.monaco.languages.setMonarchTokensProvider('geos_xml', language);
		this.monaco.languages.registerDocumentFormattingEditProvider('geos_xml', {
			provideDocumentFormattingEdits: (model, options, token) => {
				const text = model.getValue();
				const formatted = formatXml(text);
				return [
					{
						range: model.getFullModelRange(),
						text: formatted
					}
				];
			}
		});
	}

	setLightTheme(light: boolean): void {
		this.monaco.editor.setTheme(light ? 'vs' : 'vs-dark');
	}

	public setup(params: { container: HTMLElement }) {
		// Your monaco instance is ready, let's display some code!
		this.editor = this.monaco.editor.create(params.container, {
			automaticLayout: true,
			dragAndDrop: true,
			dropIntoEditor: { enabled: true }
		});
	}

	public destroy() {
		this.editor?.dispose();
	}

	public static async create() {
		// const monaco = await loader.init();
		const monaco = (await import('./monaco')).default;
		return new MonacoCodeEditor({ monaco });
	}

	public createModel(params: { value?: string; language?: string }) {
		const model = this.monaco.editor.createModel(params.value ?? '', params.language);
		this.editor?.setModel(model);
	}
}
