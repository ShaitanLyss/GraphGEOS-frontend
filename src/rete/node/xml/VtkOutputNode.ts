import { XmlNode } from './XmlNode';

export class VtkOutputNode extends XmlNode {
    constructor() {
        super('VtkOutput', {
            outData: {
                name: 'vtkOutput',
                displayName: 'Vtk Output',
                type: 'output'
            },
        });
    }
}
