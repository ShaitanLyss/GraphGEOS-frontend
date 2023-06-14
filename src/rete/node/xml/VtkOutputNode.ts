import { XmlNode } from './XmlNode';

export class VtkOutputNode extends XmlNode {
	constructor() {
		super('VtkOutput', {
			xmlTag: 'VTK',
			outData: {
				name: 'vtkOutput',
				displayName: 'Vtk Output',
				type: 'output'
			}
		});
	}
}
