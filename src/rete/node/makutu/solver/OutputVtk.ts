import { SolverAPINode } from './SolverAPINode';

export class OutputVtkNode extends SolverAPINode {
	constructor() {
		super('Output VTK', 'http://localhost:3000/api/v1/solver/output_vtk');
	}
}
