import { ClassicPreset } from 'rete';
import { Node } from '../Node';
import { Socket } from '../../socket/Socket';

export class NumberNode extends Node {
	height = 120;
	width = 180;

	constructor(initial: number, change?: () => void) {
		super('Number');
		this.addControl(
			'value',
			new ClassicPreset.InputControl('number', { initial, change: this.processDataflow })
		);
		this.addOutput('value', new ClassicPreset.Output(new Socket({ type: 'number' }), 'Number'));
	}

	data(): { value: number } {
		return {
			value:
				this.controls.value instanceof ClassicPreset.InputControl ? this.controls.value.value : 0
		};
	}
}
