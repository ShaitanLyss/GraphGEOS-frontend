import type { NodeParams } from '../../Node';
import { ObjectAPINode } from '../../ObjectAPINode';

export class SolverAPINode extends ObjectAPINode {
	constructor(name: string, url: string, { factory, height = 218, width = undefined }: NodeParams) {
		super(name, {
			url: '/makutu/solver' + url,
			height: height,
			width: width,
			objectKey: 'solver',
			objectLabel: 'Solver',
			factory
		});
	}
}
