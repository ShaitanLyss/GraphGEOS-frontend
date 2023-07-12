import type { NodeFactory } from '$rete/node/NodeFactory';
import { XmlNode } from '../XmlNode';
import type { XmlProperty } from '../types';

export class BoxXmlNode extends XmlNode {
	constructor({
		factory,
		initialValues = {}
	}: {
		factory: NodeFactory;
		initialValues?: Record<string, unknown>;
	}) {
		super({
			label: 'Box',
			factory,
			xmlConfig: {
				xmlTag: 'Box',
				outData: {
					name: 'box',
					displayName: 'Box',
					type: 'geometry'
				},
				xmlProperties: [
					{
						name: 'xMin',
						type: 'vector',
						controlType: 'vector'
					},
					{
						name: 'xMax',
						type: 'vector',
						controlType: 'vector'
					}
				]
			},
			width: 260,
			params: { initialValues }
		});
	}
	override getProperties(inputs?: Record<string, unknown> | undefined): Record<string, unknown> {
		const properties = super.getProperties(inputs);
		const xMin = this.getData('xMin', inputs) as Record<string, number>;
		const xMax = this.getData('xMax', inputs) as Record<string, number>;
		(properties['xMin'] = Object.values(xMin)), (properties['xMax'] = Object.values(xMax));

		return properties;
	}
}
