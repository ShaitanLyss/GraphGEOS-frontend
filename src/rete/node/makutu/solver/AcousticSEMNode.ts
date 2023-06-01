import { Node } from '../../Node';
import { Socket } from '../../../socket/Socket';
import { Input } from '../../../Input';
import { PythonObject} from '../../../../backend-interaction/python';
/**
 * This node displays the value of the input.
 */
export class AcousticSEMNode extends Node {
	height = 250;
	width = 180;

	constructor() {
		super('AcousticSEM');

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

		this.addOutData({
			name: 'solver',
			inputLabel: 'Solver',
			type: 'pythonObject'
		})

		// Display value
	}

	data(inputs: Record<string, object>): Record<string, object> | Promise<Record<string, object>> {
		return {solver: new PythonObject(10n)};
	}
}
