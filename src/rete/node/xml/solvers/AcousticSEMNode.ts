import type { NodeFactory } from '$rete/node/NodeFactory';
import { XmlNode } from '../XmlNode';

export class AcousticSEMNode extends XmlNode {
	constructor({
		factory,
		initialValues = {}
	}: {
		factory: NodeFactory;
		initialValues?: Record<string, unknown>;
	}) {
		super({
			label: 'AcousticSEM',
			factory,
			height: 200,
			params: { initialValues },
			xmlConfig: {
				xmlTag: 'AcousticSEM',
				outData: {
					type: 'solver',
					name: 'solver',
					displayName: 'Solver',
					socketLabel: 'Solver'
				},

				xmlProperties: [
					{
						name: 'cflFactor',
						type: 'number',
						controlType: 'number'
					},
					{
						name: 'discretization',
						type: 'string'
					},
					{
						name: 'targetRegions',
						type: 'string',
						isArray: true
					},
					{
						name: 'sourceCoordinates',
						type: 'vector',
						isArray: true
					},
					{
						name: 'timeSourceFrequency',
						type: 'number',
						controlType: 'number'
					},
					{
						name: 'receiverCoordinates',
						type: 'vector',
						isArray: true
					},
					{
						name: 'outputSeismoTrace',
						type: 'boolean',
						controlType: 'checkbox'
					},
					{
						name: 'dtSeismoTrace',
						type: 'number',
						controlType: 'number'
					}
				]
			}
		});
	}
}
