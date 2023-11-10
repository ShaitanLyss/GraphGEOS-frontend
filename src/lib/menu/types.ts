import type { EditorType } from '$lib/editor/types';
import type { NodeFactory } from '$rete';

interface IMenuItem {
	getLabel: () => string;
	getDescription: () => string;
	getType: () => MenuItemType;
	getTags: () => string[];
}

enum MenuItemType {
	Node,
	Action
}

interface INodeMenuItem extends IMenuItem {
	getInTypes: () => string[];
	getOutTypes: () => string[];
	getAddNode: ({ factory }: { factory: NodeFactory }) => Node;
	getEditorType: () => EditorType;
}

interface IActionMenuItem extends IMenuItem {
	executeAction: () => void;
}

function createMenuItem(properties: {
	label: string;
	description: string;
	type: MenuItemType;
	tags: string[]; // Include tags in the properties
}): IMenuItem {
	return {
		getLabel: () => properties.label,
		getDescription: () => properties.description,
		getType: () => properties.type,
		getTags: () => properties.tags // Implement getter for tags
	};
}

/**
 * Returns a new INodeMenuItem
 * @param properties
 * @returns
 */
function createNodeMenuItem(properties: {
	label: string;
	description: string;
	tags: string[];
	inTypes: string[];
	outTypes: string[];
	addNode: ({ factory }: { factory: NodeFactory }) => Node;
	editorType: EditorType;
}): INodeMenuItem {
	return {
		...createMenuItem({ ...properties, type: MenuItemType.Node }),
		getInTypes: () => properties.inTypes,
		getOutTypes: () => properties.outTypes,
		getAddNode: ({ factory }) => properties.addNode({ factory }),
		getEditorType: () => properties.editorType
	};
}
