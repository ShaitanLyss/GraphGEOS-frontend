import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { CodeEditor } from '../../CodeEditor';
import formatXml from 'xml-formatter';
import { conf, language } from './geos_xml';
import loader from '@monaco-editor/loader';

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
		this.monaco.languages.registerHoverProvider('geos_xml', {
			provideHover(model, position, token) {
				const hoveredWord = model.getWordAtPosition(position);
				if (!hoveredWord) return null;
				console.log('hoveredWord', hoveredWord);
				// The following regex first discriminates <? to avoid tagging <?xml as a tag
				const tagMatch = model.findPreviousMatch(
					'(?:<\\?|>|<(\\w+)[\\s\\r\\n]+|</?\\s*(\\w+))',
					position,
					true,
					false,
					null,
					true
				);
				const isWithinTag = tagMatch !== null && tagMatch.matches?.at(1) !== undefined;
				const isTag = tagMatch !== null && tagMatch.matches?.at(2) !== undefined;
				console.log('isTag', isTag, 'isWithinTag', isWithinTag);

				if (isTag) {
					return { contents: [{ value: 'Tag : ' + hoveredWord.word }] };
				}
				if (isWithinTag) {
					const attributeMatch = model.findPreviousMatch(
						'(?:\\w[\\s\\r\\n]*|(=))',
						{ column: hoveredWord.startColumn, lineNumber: position.lineNumber },
						true,
						false,
						null,
						true
					);
					console.log('attributeMatch', attributeMatch?.matches);
					console.log(attributeMatch?.matches?.at(1) === undefined);
					const isAttr =
						attributeMatch !== null &&
						attributeMatch.matches?.at(1) === undefined &&
						attributeMatch.matches?.at(0) !== '=';
					if (isAttr) {
						return { contents: [{ value: 'Attribute : ' + hoveredWord.word }] };
					}
				}
				return { contents: [] };
			}
		});
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
		const monaco = await loader.init();
		// const monaco = (await import('./monaco')).default;
		return new MonacoCodeEditor({ monaco });
	}

	public createModel(params: { value?: string; language?: string }) {
		const model = this.monaco.editor.createModel(params.value ?? '', params.language);
		this.editor?.setModel(model);
	}
}
