import type { NodeFactory } from '$rete/node/NodeFactory';
import { XmlNode } from '../XmlNode';

export class FiniteElementSpaceNode extends XmlNode {
	constructor({
		factory,
		initialValues
	}: {
		factory: NodeFactory;
		initialValues: Record<string, unknown>;
	}) {
		super({
			label: 'FiniteElementSpace',
			factory,
			params: { initialValues },
			xmlConfig: {
				xmlTag: 'FiniteElementSpace',
				outData: {
					type: 'any',
					name: 'FiniteElementSpace',
					displayName: 'FiniteElementSpace',
					socketLabel: 'FiniteElementSpace'
				},
				xmlProperties: [
					{
						name: 'order',
						type: 'number',
						controlType: 'number'
					},
					{
						name: 'formulation',
						type: 'string',
						controlType: 'text'
					}
				]
			}
		});
	}
}
