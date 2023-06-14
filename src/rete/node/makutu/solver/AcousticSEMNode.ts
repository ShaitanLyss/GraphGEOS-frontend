import { Node } from '../../Node';
import { Socket } from '../../../socket/Socket';
import { Input } from '../../../Input';
import { PythonObject } from '../../../../backend-interaction/python';
import { SolverAPINode } from './SolverAPINode';
import { APINode } from '../../APINode';
import type { NodeFactory } from '../../NodeFactory';

/**
 * This node displays the value of the input.
 */
export class AcousticSEMNode extends APINode {
	// height = 150;
	width = 180;

	constructor({ factory }: { factory: NodeFactory }) {
		super('Create AcousticSEM', {
			factory,
			url: '/makutu/solver/create-acoustic-sem',
			height: 180
		});

		this.addOutData({
			name: 'solver',
			displayName: 'Solver',
			socketLabel: 'Solver',
			type: 'pythonObject'
		});

		// Display value
	}

	// data(inputs: Record<string, object>): Record<string, object> | Promise<Record<string, object>> {
	// 	return { solver: new PythonObject(10) };
	// }
}
