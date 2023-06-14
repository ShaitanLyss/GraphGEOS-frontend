import { NodeFactory } from '../../NodeFactory';
import { SolverAPINode } from './SolverAPINode';

export class ExecuteNode extends SolverAPINode {
	constructor({ factory }: { factory: NodeFactory }) {
		super('Execute Solver', '/execute', { factory });
	}
}
