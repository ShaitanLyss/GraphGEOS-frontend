import { ClassicPreset } from 'rete';
import { Node } from '../MyTypes';
import { Socket } from '../../socket/Socket';
import { Input } from '../../Input';

/**
 * This node displays the value of the input.
 */
export class ProblemNode extends Node {
	height = 250;
	width = 180;

	constructor(initial = 0) {
		super('Problem');

		// Setup input
		this.addInput(
			'solvers',
			new Input(
				new Socket({
					name: 'Solvers',
					isArray: true,
					isRequired: true,
					type: 'solver'
				}),
				'Solvers',
				true
			)
		);

		this.addInput(
			'mesh',
			new Input(
				new Socket({
					name: 'Mesh',
					type: 'mesh',
					isArray: false,
					isRequired: true
				}),
				'Mesh',
				false
			)
		);

		this.addInput(
			'geometry',
			new Input(
				new Socket({
					name: 'Geometry',
					isArray: true,
					isRequired: false,
					type: 'geometry'
				}),
				'Geometry',
				true
			)
		);

		// Display value
	}

	data(inputs: Record<string, object>): Record<string, object> | Promise<Record<string, object>> {
		return {};
	}
}
