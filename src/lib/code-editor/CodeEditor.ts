import type { GeosSchema } from '$lib/geos';
import { ErrorWNotif } from '$lib/global';
import type { Action } from 'svelte/action';
import { writable, type Writable } from 'svelte/store';

export interface ICodeEditor {
	destroy(): void;
	createModel(params: { language?: string; value?: string }): void;
	setLightTheme(light: boolean): void;
	getText(): { text: string; cursorOffset: number | null };
	setText(params: { text: string; cursorOffset?: number | null }): void;
	_setup(params: { container: HTMLElement }): void;
}

export type codeEditorBackends = 'monaco';

export function makeCodeEditor(params: { backend: codeEditorBackends; geosSchema: GeosSchema }): {
	codeEditor: ICodeEditor;
	codeEditorStore: Writable<ICodeEditor>;
	codeEditorPromise: Promise<ICodeEditor>;
	codeEditorAction: Action<HTMLDivElement>;
} {
	const editorStore = writable<ICodeEditor>(undefined);
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
								const res = (typed_codeEditor[prop] as CallableFunction)(...args);
								if (res)
									console.warn(
										"Proxy method call returned a value, it won't be available, make sure this is intended"
									);
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
				codeEditor._setup({ container: node });
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
}): Promise<ICodeEditor> {
	switch (params.backend) {
		case 'monaco':
			return await (
				await import('./backends/monaco/MonacoCodeEditor')
			).default.create({ geosSchema: params.geosSchema });
		default:
			throw new Error('Not implemented');
	}
}
