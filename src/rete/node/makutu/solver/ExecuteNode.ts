import { SolverAPINode } from './SolverAPINode';

export class ExecuteNode extends SolverAPINode {
	constructor() {
		super('Execute Solver', 'https://makutu.app/api/v1/solver/execute');
	}
}
