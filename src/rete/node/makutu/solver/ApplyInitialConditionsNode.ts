import { SolverAPINode } from './SolverAPINode';

export class ApplyInitialConditionsNode extends SolverAPINode {
	constructor() {
		super(
			'Apply Initial Conditions',
			'http://localhost:3000/api/v1/solver/apply_initial_conditions'
		);
	}
}
