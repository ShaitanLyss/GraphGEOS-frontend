import type { NodeFactory } from '$rete/node/NodeFactory';
import { XmlNode } from '../XmlNode';

export class CellElementRegionNode extends XmlNode {
	//     <CellElementRegion
	//       name="Region"
	// cellBlocks = "{ hexahedra }"
	// materialList = "{ nullModel }" />
	constructor({
		factory,
		initialValues = {}
	}: {
		factory: NodeFactory;
		initialValues?: Record<string, unknown>;
	}) {
		super({
			label: 'CellElementRegion',
			factory,
			height: 160,
			params: { initialValues },
			xmlConfig: {
				xmlTag: 'CellElementRegion',
				outData: {
					type: 'elementRegion',
					name: 'region',
					displayName: 'Region',
					socketLabel: 'Region'
				},
				xmlProperties: [
					{
						name: 'cellBlocks',
						type: 'string',
						isArray: true
					},
					{
						name: 'materialList',
						type: 'string',
						isArray: true
					}
				]
			}
		});
	}
}
