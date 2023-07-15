import type { NodeFactory } from '../../NodeFactory';
import { SolverAPINode } from './SolverAPINode';

export class ExecuteNode extends SolverAPINode {
	constructor({ factory }: { factory: NodeFactory }) {
		super({ label: 'Execute Solver', url: '/execute', factory });
		this.pythonComponent.addCode('$(solver).execute()');
	}
}
