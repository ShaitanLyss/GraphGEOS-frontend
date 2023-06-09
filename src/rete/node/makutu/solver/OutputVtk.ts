import { SolverAPINode } from './SolverAPINode';

export class OutputVtkNode extends SolverAPINode {
	constructor() {
		super('Output VTK', '/output_vtk');
	}
}
