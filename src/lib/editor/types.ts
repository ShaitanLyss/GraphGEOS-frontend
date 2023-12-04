import type { NodeEditorSaveData } from '$rete/NodeEditor';
import type { EditorExample } from '$rete/example/types';

export type EditorView = {
	key: string;
	example?: EditorExample;
	label: string;
	saveData?: NodeEditorSaveData;
};

export enum EditorType {
	XML,
	All,
	PyWorkflow
}

export type DragData = { type: 'macroNode'; graphId: string };
