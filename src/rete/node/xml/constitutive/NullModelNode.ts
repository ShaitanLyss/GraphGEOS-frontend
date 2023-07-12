import type { NodeFactory } from '$rete/node/NodeFactory';
import { XmlNode } from '../XmlNode';

export class NullModelNode extends XmlNode {
	constructor({ factory }: { factory: NodeFactory }) {
		super({
			label: 'NullModel',
			factory,
			xmlConfig: {
				xmlTag: 'NullModel',
				outData: {
					type: 'constitutive',
					name: 'NullModel',
					displayName: 'NullModel',
					socketLabel: 'NullModel'
				}
			}
		});
	}
}
