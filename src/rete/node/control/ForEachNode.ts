import { structures } from 'rete-structures';
import { Connection, Node } from '../Node';

// Class defining a For Each Node
export class ForEachNode extends Node {
	currentItemIndex?: number = undefined;

	constructor() {
		super('For Each', { height: 275 });
		this.addInExec();
		this.addOutExec('loop', 'Loop');
		this.addInData({ name: 'array', displayName: 'Array', isArray: true });
		this.addOutData({ name: 'item', displayName: 'Item' });
		this.addOutData({ name: 'index', displayName: 'Index' });
		this.addOutExec('exec', 'Done');
	}
	// Executes the node
	override async execute(input: string, forward: (output: string) => unknown): Promise<void> {
		const inputs = await this.fetchInputs();
		const array = inputs.array[0];

		const connections = this.getEditor().getConnections();
		const loopNode = connections
			.filter(
				(connection) =>
					connection.source === this.id && (connection as Connection).sourceOutput === 'loop'
			)
			.map((connection) => this.getEditor().getNode(connection.target))[0];

		if (loopNode) {
			const leavesFromLoopExec = structures(this.getEditor())
				.outgoers(loopNode.id)
				.union({ nodes: [loopNode], connections: [] })
				.leaves()
				.nodes();

			for (let i = 0; i < array.length; i++) {
				this.currentItemIndex = i;

				this.getDataflowEngine().reset(this.id);
				forward('loop');

				await Promise.all(leavesFromLoopExec.map((node) => node.waitForEndExecutePromise()));
			}
		}

		forward('exec');
	}
	// Gets the data
	data(inputs: { array?: unknown[][] }): { item: unknown; index?: number } {
		if (this.currentItemIndex === undefined) {
			return { item: undefined, index: undefined };
		}

		const array = inputs.array ? inputs.array[0] : [];

		const item = array[this.currentItemIndex];
		return { item, index: this.currentItemIndex };
	}
}
