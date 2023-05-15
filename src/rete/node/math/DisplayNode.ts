import { ClassicPreset } from 'rete';
import { Node } from '../MyTypes';
import { Socket } from '../../socket/Socket';

/**
 * This node displays the value of the input.
 */
export class DisplayNode extends Node {
	height = 120;
	width = 180;

	constructor(initial = 0, change?: () => void) {
		super('Display');

		// Setup input
		const input = new ClassicPreset.Input(new Socket(), '');
		input.addControl(new ClassicPreset.InputControl('number', { initial, change }));
		this.addInput('input', input);

		// Display value
		this.addControl('display', new ClassicPreset.InputControl('text', { initial, readonly: true }));
	}

	data(inputs: { input?: number[] }): Record<string, object> {
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
