import { PythonObject } from '../../../../backend-interaction/python';
import { SolverAPINode } from './SolverAPINode';

export class InitializeSolverNode extends SolverAPINode {
	constructor() {
		super('Initialize Solver', 'http://localhost:3000/api/v1/solver/initialize');

		this.addInData({
			name: 'xml',
			displayName: 'XML',
			socketLabel: 'XML',
			type: 'pythonObject'
		});
	}
}
