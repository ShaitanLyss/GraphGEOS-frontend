import { APINode } from '../../APINode';

export class SolverAPINode extends APINode {
	constructor(name: string, url: string) {
		super(name, { url: url });
		this.addInData({
			name: 'solver',
			inputLabel: 'Solver',
            type: 'pythonObject',
		});
	}
}
