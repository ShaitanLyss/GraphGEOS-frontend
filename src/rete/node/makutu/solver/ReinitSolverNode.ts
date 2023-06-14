import { NodeFactory } from '../../NodeFactory';
import { SolverAPINode } from './SolverAPINode';

export class ReinitSolverNode extends SolverAPINode {
	constructor({factory} : {factory: NodeFactory}) {
		super('Reinit Solver', '/reinit-solver', {factory});
	}
}
