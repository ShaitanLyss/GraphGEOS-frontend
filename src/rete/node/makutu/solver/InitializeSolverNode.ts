import { PythonObject } from '../../../../backend-interaction/python';
import { SolverAPINode } from './SolverAPINode';

export class InitializeSolverNode extends SolverAPINode {
	constructor() {
		super('Initialize Solver', '/initialize', {
			height: 250
		});

		this.addInData({
			name: 'xml',
			displayName: 'XML',
			socketLabel: 'XML',
			type: 'pythonObject'
		});
	}
}
