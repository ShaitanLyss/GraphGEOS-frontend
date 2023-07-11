import { XmlNode } from './XmlNode';
import type { NodeFactory } from '$rete/node/NodeFactory';

export class VtkOutputNode extends XmlNode {
	constructor({factory}: {factory: NodeFactory}) {
		super({label:'VtkOutput', factory, xmlConfig: {
			xmlTag: 'VTK',
			outData: {
				name: 'vtkOutput',
				displayName: 'Vtk Output',
				type: 'output'
			}
		}});
	}
}
