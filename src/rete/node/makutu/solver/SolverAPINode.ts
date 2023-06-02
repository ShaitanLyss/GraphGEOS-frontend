import { NodeParams } from '../../Node';
import { ObjectAPINode } from '../../ObjectAPINode';

export class SolverAPINode extends ObjectAPINode {
	constructor(name: string, url: string, { height = 218, width = undefined }: NodeParams = {}) {
		super(name, {
			url: url,
			height: height,
			width: width,
			objectKey: 'solver',
			objectLabel: 'Solver'
		});
	}
}
