import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { ICodeEditor } from '../../CodeEditor';
// import formatXml from 'xml-formatter';
import { conf, getGeosXmlCompletionItemProvider, language } from './geos_xml';
import loader from '@monaco-editor/loader';
import type { GeosSchema } from '$lib/geos';
import { formatXml } from '$utils';
import { ErrorWNotif } from '$lib/global';

export default class MonacoCodeEditor implements ICodeEditor {
	private monaco: typeof Monaco;
	private editor?: Monaco.editor.IStandaloneCodeEditor;
	private geosSchema: GeosSchema;
	private model?: Monaco.editor.ITextModel;

	private constructor(params: { monaco: typeof Monaco; geosSchema: GeosSchema }) {
		const { geosSchema } = params;
		this.geosSchema = params.geosSchema;
		this.monaco = params.monaco;
		// Register XML configuration
		const geos_xml = this.monaco.languages.getLanguages().find((v) => v.id == 'geos_xml');
		if (geos_xml) return;
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
					const tag = hoveredWord.word;
					const complexType = geosSchema.complexTypes.get(tag);
					if (complexType) {
						return {
							contents: [
								{
									supportHtml: true,
									value: `<b><a href="${
										complexType.link
									}"> ${tag}</a></b><br/><ul><li>${complexType.childTypes.join(
										'</li><li>'
									)}</li></ul>
						`
								}
							]
						};
					} else {
						console.error(`${tag} not found`);
					}
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
						const tag = tagMatch.matches?.at(1);
						if (tag) {
							const complexType = geosSchema.complexTypes.get(tag);
							if (complexType) {
								const attr = complexType.attributes.get(hoveredWord.word);
								if (attr) {
									const requiredOrDefault = attr.required ? '<small> required</small>' : '';
									return {
										contents: [
											{
												supportHtml: true,
												value: `<b>${attr.name} </b><i> ${attr.type}</i><br/>${requiredOrDefault}<br/>${attr.description}`
											}
										]
									};
								}
							}
						}
					}
				}
				return { contents: [] };
			}
		});
		this.monaco.languages.registerCompletionItemProvider(
			'geos_xml',
			getGeosXmlCompletionItemProvider({ geosSchema, monaco: this.monaco })
		);
		this.monaco.languages.registerDocumentFormattingEditProvider('geos_xml', {
			provideDocumentFormattingEdits: (model, options, token) => {
				const xml = model.getValue();
				const formatted = formatXml({ xml });
				return [
					{
						range: model.getFullModelRange(),
						text: formatted
					}
				];
			}
		});
	}
	getSelectedText(): string {
		if (!this.editor) throw new ErrorWNotif('Editor not created');
		const editor = this.editor;
		const selections = this.editor.getSelections();
		if (selections === null) return '';
		return selections
			.map((selection) => editor.getModel()?.getValueInRange(selection) ?? '')
			.join('\n');
	}
	setText(params: { text: string; cursorOffset?: number | null }): void {
		if (params.cursorOffset === undefined) params.cursorOffset = null;
		if (!this.model) throw new ErrorWNotif('Model not created');
		this.model.setValue(params.text);
		if (params.cursorOffset !== null) {
			const position = this.model.getPositionAt(params.cursorOffset);
			this.editor?.setPosition(position);
		}
	}

	setLightTheme(light: boolean): void {
		this.monaco.editor.setTheme(light ? 'vs' : 'vs-dark');
	}

	public setup_(params: { container: HTMLElement }) {
		// Your monaco instance is ready, let's display some code!
		this.editor = this.monaco.editor.create(params.container, {
			automaticLayout: true,
			dragAndDrop: true,
			dropIntoEditor: { enabled: true }
		});
	}

	public destroy() {
		this.editor?.dispose();
		this.model?.dispose();
	}

	public static async create({ geosSchema }: { geosSchema: GeosSchema }) {
		const monaco = await loader.init();
		// const monaco = (await import('./monaco')).default;
		return new MonacoCodeEditor({ monaco, geosSchema });
	}

	public createModel(params: { value?: string; language?: string }) {
		const model = this.monaco.editor.createModel(params.value ?? '', params.language);
		this.editor?.setModel(model);
		this.model = model;
	}

	public getText() {
		const res: ReturnType<ICodeEditor['getText']> = { text: '', cursorOffset: null };
		if (!this.model) throw new ErrorWNotif('Model not created');
		res.text = this.model.getValue();
		if (!this.editor) {
			console.error('Editor not created');
			return res;
		}
		const position = this.editor.getPosition();
		if (!position) {
			console.error('Position not found');
			return res;
		}
		res.cursorOffset = this.model.getOffsetAt(position);
		return res;
	}
}
