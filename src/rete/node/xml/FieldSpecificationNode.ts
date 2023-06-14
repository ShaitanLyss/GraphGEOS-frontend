import { XmlNode } from './XmlNode';

export class FieldSpecificationNode extends XmlNode {
	constructor(initialValues: Record<string, unknown> = {}) {
		super('Field Specification', {
			// height: 340,
            xmlTag: 'FieldSpecification',
			outData: {
				name: 'fieldSpecification',
				displayName: 'Field Specification',
				type: 'fieldSpecification'
			},
			initialValues: initialValues,
			xmlProperties: [
				{
					name: 'objectPath',
					type: 'string',
					controlType: 'text'
				},
				{
					name: 'fieldName',
					type: 'string',
					controlType: 'text'
				},
				{
					name: 'scale',
					type: 'number',
					controlType: 'number'
				},
				{
					name: 'setNames',
					type: 'string',
					isArray: true
				},
				{
					name: 'initialCondition',
					type: 'boolean',
					controlType: 'checkbox'
				}
			]
		});
	}
}
