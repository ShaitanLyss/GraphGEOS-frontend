import { NodeEditor as BaseNodeEditor } from 'rete';
import type { Schemes } from './node/Schemes';
import { Connection, Node, NodeSaveData } from './node/Node';

export type NodeEditorSaveData = {
	nodes: NodeSaveData[];
	connections: string[];
	editorName: string;
};

export class NodeEditor extends BaseNodeEditor<Schemes> {
	setName(name: string, triggerListeners: boolean = true) {
		this.name = name;
		if (triggerListeners) this.onChangeNameListeners.forEach((listener) => listener(name));
	}
	name: string = 'New Editor';
	onChangeNameListeners: ((name: string) => void)[] = [];

	async addExecConnection(source: Node, target: Node): Promise<boolean> {
		return await this.addConnection(new Connection(source, 'exec', target, 'exec'));
	}

	async addNewConnection(
		source: Node | string,
		sourceOutput: string,
		target: Node | string,
		targetInput: string
	): Promise<boolean> {
		return await this.addConnection(new Connection(source, sourceOutput, target, targetInput));
	}

	addOnChangeNameListener(listener: (name: string) => void) {
		this.onChangeNameListeners.push(listener);
	}

	toJSON(): NodeEditorSaveData {
		return {
			nodes: this.getNodes().map((node) => node.toJSON()),
			connections: this.getConnections().map((conn) => JSON.stringify(conn)),
			editorName: this.name
		};
	}
}
