import { NodeEditor as BaseNodeEditor } from 'rete';
import { Schemes } from './node/Schemes';
import { Connection, Node } from './node/Node';

export class NodeEditor extends BaseNodeEditor<Schemes> {
	async addExecConnection(source: Node, target: Node): Promise<boolean> {
		return await this.addConnection(new Connection(source, 'exec', target, 'exec'));
	}
}
