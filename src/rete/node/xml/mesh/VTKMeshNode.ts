import type { NodeFactory } from '$rete/node/NodeFactory';
import { XmlNode } from '../XmlNode';

export class VTKMeshNode extends XmlNode {
	//     <VTKMesh
	//       name="mesh"
	// fieldsToImport = "{ mediumVelocity }"
	// fieldNamesInGEOSX = "{ mediumVelocity }"
	// file = "../models/bicouche50x50x50.vtu" />
	constructor({
		factory,
		initialValues = {}
	}: {
		factory: NodeFactory;
		initialValues?: Record<string, unknown>;
	}) {
		super({
			label: 'VTKMesh',
			height: 160,
			factory,
			params: { initialValues },
			xmlConfig: {
				xmlTag: 'VTKMesh',
				outData: {
					type: 'mesh',
					name: 'mesh',
					displayName: 'Mesh',
					socketLabel: 'Mesh'
				},
				xmlProperties: [
					{
						name: 'fieldsToImport',
						type: 'string',
						isArray: true
					},
					{
						name: 'fieldNamesInGEOSX',
						type: 'string',
						isArray: true
					},
					{
						name: 'file',
						type: 'string',
						controlType: 'text'
					}
				]
			}
		});
	}
}
