import { SolverAPINode } from './SolverAPINode';

export class ApplyInitialConditionsNode extends SolverAPINode {
	constructor() {
		super('Apply Initial Conditions', '/apply_initial_conditions');
	}
}
