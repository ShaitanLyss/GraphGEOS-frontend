import { NodeEditor as BaseNodeEditor } from 'rete';
import type { Schemes } from './node/Schemes';
import { Connection, Node } from './node/Node';

export class NodeEditor extends BaseNodeEditor<Schemes> {
	async addExecConnection(source: Node, target: Node): Promise<boolean> {
		return await this.addConnection(new Connection(source, 'exec', target, 'exec'));
	}

	async addNewConnection(
		source: Node,
		sourceOutput: string,
		target: Node,
		targetInput: string
	): Promise<boolean> {
		return await this.addConnection(new Connection(source, sourceOutput, target, targetInput));
	}
}
