import { SolverAPINode } from './SolverAPINode';

export class ExecuteNode extends SolverAPINode {
	constructor() {
		super('Execute Solver', '/execute');
	}
}
