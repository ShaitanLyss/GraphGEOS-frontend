import { ClassicPreset as Classic, ClassicPreset, NodeEditor } from 'rete';
import { DataflowEngine } from 'rete-engine';
import type DataflowNode from 'rete-engine';
import { Node, socket } from '../MyTypes';

export class AddNode extends Node {
	constructor({ a = 0, b = 0 } = {}) {
		super('Add');
		this.height = 160;

		const left = new ClassicPreset.Input(socket, '');
		const right = new ClassicPreset.Input(socket, '');

		left.addControl(
			new ClassicPreset.InputControl('number', { initial: a, change: this.processDataflow })
		);
		right.addControl(
			new ClassicPreset.InputControl('number', { initial: b, change: this.processDataflow })
		);

		this.addInput('left', left);
		this.addInput('right', right);

		this.addOutput('value', new ClassicPreset.Output(socket, 'Number'));
	}

	data(inputs: { left?: number[]; right?: number[] }): { value: number } {
		const leftControl = this.inputs.left?.control as ClassicPreset.InputControl<'number'>;

		const rightControl = this.inputs.right?.control as ClassicPreset.InputControl<'number'>;

		const { left, right } = inputs;
		const value =
			(left ? left[0] : leftControl.value || 0) + (right ? right[0] : rightControl.value || 0);

		// this.controls.value.setValue(value);

		// if (this.update) this.update(this.controls.value);

		return { value };
	}
}
