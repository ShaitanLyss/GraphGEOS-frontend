import { PythonObject } from '../../../../backend-interaction/python';
import { NodeFactory } from '../../NodeFactory';
import { SolverAPINode } from './SolverAPINode';

export class InitializeSolverNode extends SolverAPINode {
	constructor({ factory }: { factory: NodeFactory }) {
		super('Initialize Solver', '/initialize', {
			height: 250,
			factory
		});

		this.addInData({
			name: 'xml',
			displayName: 'XML',
			socketLabel: 'XML',
			type: 'pythonObject'
		});
	}
}
