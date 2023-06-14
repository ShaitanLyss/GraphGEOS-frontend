import { XmlNode, XmlNodeParams } from '../XmlNode';

export class BoxXmlNode extends XmlNode {
	constructor(initialValues: Record<string, unknown> = {}) {
		super('Box', {
			xmlTag: 'Box',
			outData: {
				name: 'box',
				displayName: 'Box',
				type: 'geometry'
			},
			width: 260,
			initialValues: initialValues,
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
		});
	}
}
