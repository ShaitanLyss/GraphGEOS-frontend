import { ButtonControl } from '../../control/button/button';
import { Node } from '../Node';
import { NodeFactory } from '../NodeFactory';
import { getLeavesFromOutput } from '../utils';

export class SequenceNode extends Node {
	constructor({factory} : {factory: NodeFactor) {
		super('Sequence', { factory, height: 220 });
		this.addInExec();
		this.addOutExec('exec-0', '0');
		this.addOutExec('exec-1', '1', false);
		this.addControl('addPinBtn', new ButtonControl('+', this.addPin.bind(this)));
	}

	addPin() {
		const newPinId = Object.keys(this.outputs).length;
		this.addOutExec('exec-' + Object.keys(this.outputs).length, newPinId.toString(), true);
		this.height += 47;
		this.updateElement('node', this.id);
	}
	override async execute(input: string, forward: (output: string) => unknown): Promise<void> {
		for (const key in this.outputs) {
			const promises = this.getWaitPromises(getLeavesFromOutput(this, key));
			forward(key);
			await Promise.all(promises);
		}
		super.execute(input, forward, false);
	}
}
