import { NodeEditor as BaseNodeEditor } from 'rete';
import type { Schemes } from './node/Schemes';
import { Connection, Node, type NodeSaveData } from './node/Node';
import { newUniqueId } from '$utils';
import type { Variable } from '../overlay/variables-list';
import { get, writable, type Writable } from 'svelte/store';

export type NodeEditorSaveData = {
	nodes: NodeSaveData[];
	connections: Connection<Node, Node>[];
	editorName: string;
	variables: Record<string, Variable>;
};

export class NodeEditor extends BaseNodeEditor<Schemes> {
	variables: Writable<Record<string, Variable>> = writable({});

	setName(name: string, triggerListeners = true) {
		this.name = name;
		if (triggerListeners) this.onChangeNameListeners.forEach((listener) => listener(name));
	}
	name = 'New Editor';
	onChangeNameListeners: ((name: string) => void)[] = [];
	id = newUniqueId('node-editor');

	async addExecConnection(source: Node, target: Node): Promise<boolean> {
		return await this.addConnection(new Connection(source, 'exec', target, 'exec'));
	}

	async addNewConnection(
		source: Node | string,
		sourceOutput: string,
		target: Node | string,
		targetInput: string
	): Promise<boolean> {
		source = typeof source === 'string' ? this.getNode(source) : source;
		target = typeof target === 'string' ? this.getNode(target) : target;
		return await this.addConnection(new Connection(source, sourceOutput, target, targetInput));
	}

	addOnChangeNameListener(listener: (name: string) => void) {
		this.onChangeNameListeners.push(listener);
	}

	toJSON(): NodeEditorSaveData {
		const variables = get(this.variables);

		for (const v of Object.values(variables)) {
			variables[v.id] = { ...v, highlighted: false };
		}

		return {
			nodes: this.getNodes().map((node) => node.toJSON()),
			connections: this.getConnections(),
			editorName: this.name,
			variables
		};
	}
}
