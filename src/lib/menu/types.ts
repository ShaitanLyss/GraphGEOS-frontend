import type { EditorType } from '$lib/editor/types';
import type { NodeFactory } from '$rete';
import type { Node } from '$rete/node/Node';

interface IMenuItem {
	getLabel: () => string;
	getDescription: () => string;
	getType: () => MenuItemType;
	getTags: () => string[];
}

export enum MenuItemType {
	Base,
	Node,
	Action
}

interface INodeMenuItem extends IMenuItem {
	getInTypes: () => string[];
	getOutTypes: () => string[];
	getAddNode: () => ({ factory }: { factory: NodeFactory }) => Node;
	getEditorType: () => EditorType;
}

interface IActionMenuItem extends IMenuItem {
	executeAction: () => void;
}

export function createMenuItem(properties: {
	label: string;
	description: string;
	tags: string[]; // Include tags in the properties
}): IMenuItem {
	return {
		getLabel: () => properties.label,
		getDescription: () => properties.description,
		getType: () => MenuItemType.Base,
		getTags: () => properties.tags // Implement getter for tags
	};
}

/**
 * Returns a new INodeMenuItem
 * @param properties
 * @returns
 */
export function createNodeMenuItem(properties: {
	label: string;
	description: string;
	tags: string[];
	inTypes: string[];
	outTypes: string[];
	addNode: ({ factory }: { factory: NodeFactory }) => Node;
	editorType: EditorType;
}): INodeMenuItem {
	return {
		...createMenuItem({ ...properties }),
		getType: () => MenuItemType.Node,
		getInTypes: () => properties.inTypes,
		getOutTypes: () => properties.outTypes,
		getAddNode: () => properties.addNode,
		getEditorType: () => properties.editorType
	};
}
