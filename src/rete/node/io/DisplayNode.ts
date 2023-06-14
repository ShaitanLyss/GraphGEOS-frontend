import { ClassicPreset } from 'rete';
import { Node } from '../Node';
import { Socket } from '../../socket/Socket';
import { NodeFactory } from '../NodeFactory';

/**
 * This node displays the value of the input.
 */
export class DisplayNode extends Node {
	height = 120;
	width = 180;

	constructor({
		factory,
		initial = 0,
		change
	}: {
		factory: NodeFactory;
		initial?: unknown;
		change?: () => void;
	}) {
		super('Display', { factory });

		// Setup input
		const input = new ClassicPreset.Input(new Socket(), '');
		input.addControl(new ClassicPreset.InputControl('number', { initial, change }));
		this.addInput('input', input);

		// Display value
		this.addControl('display', new ClassicPreset.InputControl('text', { initial, readonly: true }));
	}

	data(inputs: { input?: number[] }): Record<string, unknown> | Promise<Record<string, unknown>> {
		const inputValue = inputs.input
			? inputs.input[0]
			: this.inputs.input?.control instanceof ClassicPreset.InputControl
			? this.inputs.input?.control.value
			: 0;

		if (this.controls.display instanceof ClassicPreset.InputControl) {
			this.controls.display.setValue(inputValue);
			this.updateElement('control', this.controls.display.id);
		} else {
			console.error('DisplayNode', 'this.controls.display is not an InputControl');
		}

		return {};
	}
}
