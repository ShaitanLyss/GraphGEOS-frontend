import { Node } from '../../Node';
import { Socket } from '../../../socket/Socket';
import { Input } from '../../../Input';
import { PythonObject } from '../../../../backend-interaction/python';
/**
 * This node displays the value of the input.
 */
export class AcousticSEMNode extends Node {
	height = 150;
	width = 180;

	constructor() {
		super('AcousticSEM');

		this.addOutData({
			name: 'solver',
			socketLabel: 'Solver',
			type: 'pythonObject'
		});

		// Display value
	}

	data(inputs: Record<string, object>): Record<string, object> | Promise<Record<string, object>> {
		return { solver: new PythonObject(10n) };
	}
}
