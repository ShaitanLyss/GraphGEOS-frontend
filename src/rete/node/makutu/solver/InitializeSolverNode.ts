import { PythonObject } from '../../../../backend-interaction/python';
import { NodeFactory } from '../../NodeFactory';
import { SolverAPINode } from './SolverAPINode';

export class InitializeSolverNode extends SolverAPINode {
	constructor({ factory }: { factory: NodeFactory }) {
		super({ label: 'Initialize Solver', url: '/initialize', factory, height: 250 });

		this.addInData({
			name: 'xml',
			displayName: 'XML',
			socketLabel: 'XML',
			type: 'pythonObject'
		});
	}
}
