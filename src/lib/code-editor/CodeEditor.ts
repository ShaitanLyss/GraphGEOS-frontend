import type { GeosSchema } from '$lib/geos';
import { ErrorWNotif } from '$lib/global';
import type { Action } from 'svelte/action';
import { writable, type Writable } from 'svelte/store';

export interface ICodeEditor {
	destroy(): void;
	createModel(params: { language?: string; value?: string }): void;
	setLightTheme(light: boolean): void;
}

export abstract class CodeEditor implements ICodeEditor {
	protected constructor() {}
	setLightTheme(light: boolean): void {
		throw new ErrorWNotif('Method not implemented.');
	}
	public static async create(params: {
		container: HTMLElement;
		geosSchema: GeosSchema;
	}): Promise<CodeEditor> {
		throw new ErrorWNotif('Not implemented');
	}

	public createModel(params: { language?: string; value?: string }) {
		throw new ErrorWNotif('Not implemented');
	}

	public setup(params: { container: HTMLElement }) {
		throw new ErrorWNotif('Not implemented');
	}

	public destroy() {
		throw new ErrorWNotif('Not implemented');
	}
}

export type codeEditorBackends = 'monaco';

export function makeCodeEditor(params: { backend: codeEditorBackends; geosSchema: GeosSchema }): {
	codeEditor: ICodeEditor;
	codeEditorStore: Writable<CodeEditor>;
	codeEditorPromise: Promise<CodeEditor>;
	codeEditorAction: Action<HTMLDivElement>;
} {
	const editorStore = writable<CodeEditor>(undefined);
	const codeEditorPromise = createCodeEditor(params);
	let resolvePostSetupEditorPromise: (value: ICodeEditor) => void;
	const postSetupEditorPromise = new Promise<ICodeEditor>((resolve) => {
		resolvePostSetupEditorPromise = resolve;
	});

	return {
		codeEditor: new Proxy(
			{},
			{
				get(target, prop, receiver) {
					if (typeof prop !== 'string') return;

					return (...args: unknown[]) => {
						postSetupEditorPromise.then((codeEditor) => {
							const typed_codeEditor = codeEditor as unknown as Record<string, unknown>;
							if (typeof typed_codeEditor[prop] === 'function') {
								(typed_codeEditor[prop] as CallableFunction)(...args);
							}
						});
					};
				}
			}
		) as unknown as ICodeEditor,
		codeEditorPromise,
		codeEditorStore: editorStore,
		codeEditorAction: (node) => {
			codeEditorPromise.then((codeEditor) => {
				codeEditor.setup({ container: node });
				resolvePostSetupEditorPromise(codeEditor);
				editorStore.set(codeEditor);
			});

			return {
				destroy() {
					codeEditorPromise.then((codeEditor) => {
						codeEditor.destroy();
					});
				}
			};
		}
	};
}

export async function createCodeEditor(params: {
	backend: codeEditorBackends;
	geosSchema: GeosSchema;
}): Promise<CodeEditor> {
	switch (params.backend) {
		case 'monaco':
			return await (
				await import('./backends/monaco/MonacoCodeEditor')
			).default.create({ geosSchema: params.geosSchema });
		default:
			throw new Error('Not implemented');
	}
}
