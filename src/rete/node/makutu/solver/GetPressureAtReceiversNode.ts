import { Node } from '../../Node';
import { SolverAPINode } from './SolverAPINode';

export class GetPressuresAtReceiversNode extends SolverAPINode {
	constructor() {
		super('Get Pressures At Receivers', '/get_pressures_at_receivers', {
			height: 250
		});
		this.addOutData({
			name: 'seismos',
			type: 'pythonObject',
			displayName: 'Seismos'
		});
	}
}
