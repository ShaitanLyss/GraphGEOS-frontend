// import { EditorType } from '$lib/editor/types';
import { createMenuItem, createNodeMenuItem, MenuItemType } from '$lib/menu/types';
import type { NodeFactory } from '$rete/node/NodeFactory';
import { Node } from '$rete/node/Node';

// import { Node, NodeEditor, NodeFactory } from '$rete';
import { describe, it, expect } from 'vitest';
import { EditorType as NodeEditorType } from '$lib/editor/types';

// Should create a menu item with the provided label, description and tags
describe('createMenuItem', () => {
	it('should create a menu item with the provided label, description and tags', () => {
		const properties = {
			label: 'Test Label',
			description: 'Test Description',
			tags: ['tag1', 'tag2']
		};

		const menuItem = createMenuItem(properties);

		expect(menuItem.getLabel()).toBe(properties.label);
		expect(menuItem.getDescription()).toBe(properties.description);
		expect(menuItem.getType()).toBe(MenuItemType.Base);
		expect(menuItem.getTags()).toEqual(properties.tags);
	});
});

// should create a menu item with an empty label
it('should create a menu item with an empty label', () => {
	const properties = {
		label: '',
		description: 'Test Description',
		tags: ['tag1', 'tag2']
	};

	const menuItem = createMenuItem(properties);

	expect(menuItem.getLabel()).toBe(properties.label);
});

// should create a menu item with an empty description
it('should create a menu item with an empty description', () => {
	const properties = {
		label: 'Test Label',
		description: '',
		tags: ['tag1', 'tag2']
	};

	const menuItem = createMenuItem(properties);

	expect(menuItem.getDescription()).toBe(properties.description);
});

// should create a menu item with no tags
it('should create a menu item with no tags', () => {
	const properties = {
		label: 'Test Label',
		description: 'Test Description',
		tags: []
	};

	const menuItem = createMenuItem(properties);

	expect(menuItem.getTags()).toEqual(properties.tags);
});

// Returns a new INodeMenuItem with the correct label, description, tags, inTypes, outTypes, addNode, and editorType properties
it('should return a new INodeMenuItem with the correct properties', () => {
	const addNode = ({ factory }: { factory: NodeFactory }) => {
		return new Node({ factory });
	};

	const nodeMenuItem = createNodeMenuItem({
		label: 'Node Menu Item',
		description: 'This is a node menu item',
		tags: ['tag1', 'tag2'],
		inTypes: ['type1', 'type2'],
		outTypes: ['type3', 'type4'],
		addNode: addNode,
		editorType: NodeEditorType.All
	});

	expect(nodeMenuItem.getLabel()).toBe('Node Menu Item');
	expect(nodeMenuItem.getDescription()).toBe('This is a node menu item');
	expect(nodeMenuItem.getType()).toBe(MenuItemType.Node);
	expect(nodeMenuItem.getTags()).toEqual(['tag1', 'tag2']);
	expect(nodeMenuItem.getInTypes()).toEqual(['type1', 'type2']);
	expect(nodeMenuItem.getOutTypes()).toEqual(['type3', 'type4']);
	expect(nodeMenuItem.getAddNode()).toBeDefined();
	expect(nodeMenuItem.getEditorType()).toBe(NodeEditorType.All);
});
