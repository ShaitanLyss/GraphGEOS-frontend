import { Node } from '../../Node';
import { SolverAPINode } from './SolverAPINode';

export class GetPressuresAtReceiversNode extends SolverAPINode {
	constructor() {
		super('Get Pressures At Receivers', 'http://localhost:8000/solver/get_pressures_at_receivers');
		this.addOutData({
			name: 'seismos',
			type: 'PythonObject'
		});
	}
}
