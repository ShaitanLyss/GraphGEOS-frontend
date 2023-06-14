import { ClassicPreset } from 'rete';
import { Node } from '../Node';
import { Socket } from '../../socket/Socket';
import { NodeFactory } from '../NodeFactory';

export class NumberNode extends Node {
	height = 120;
	width = 180;

	constructor({
		factory,
		initial = 0,
		change
	}: {
		factory: NodeFactory;
		initial: number;
		change?: () => void;
	}) {
		super('Number', { factory });
		this.addControl(
			'value',
			new ClassicPreset.InputControl('number', { initial, change: this.processDataflow })
		);
		this.addOutput('value', new ClassicPreset.Output(new Socket({ type: 'number' }), 'Number'));
	}

	data(): Record<string, unknown> | Promise<Record<string, unknown>> {
		return {
			value:
				this.controls.value instanceof ClassicPreset.InputControl ? this.controls.value.value : 0
		};
	}
}
