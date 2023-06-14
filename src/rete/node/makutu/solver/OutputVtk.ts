import { NodeFactory } from '../../NodeFactory';
import { SolverAPINode } from './SolverAPINode';

export class OutputVtkNode extends SolverAPINode {
	constructor({factory} : {factory: NodeFactory}) {
		super('Output VTK', '/output_vtk', {factory});
	}
}
