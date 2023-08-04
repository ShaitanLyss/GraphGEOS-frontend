import type { NodeEditorSaveData } from '$rete/NodeEditor';
import type { EditorExample } from '$rete/example/types';

export type EditorView = { key: string; example?: EditorExample; label: string, saveData?: NodeEditorSaveData };
