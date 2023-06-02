import { structures } from 'rete-structures';
import { Connection, Node } from '../Node';
import { getLeavesFromOutput } from '../utils';

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

		const leavesFromLoopExec = getLeavesFromOutput(this, 'loop');
		if (leavesFromLoopExec.length === 0) {
			super.execute(input, forward);
			return;
		}

		for (let i = 0; i < array.length; i++) {
			this.currentItemIndex = i;

			this.getDataflowEngine().reset(this.id);
			const promises = this.getWaitPromises(leavesFromLoopExec);
			forward('loop');

			await Promise.all(promises);
		}

		super.execute(input, forward);
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