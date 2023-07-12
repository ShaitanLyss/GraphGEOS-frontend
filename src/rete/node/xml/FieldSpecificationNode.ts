import type { NodeFactory } from '../NodeFactory';
import { XmlNode } from './XmlNode';

export class FieldSpecificationNode extends XmlNode {
	constructor({
		factory,
		initialValues = {}
	}: {
		factory: NodeFactory;
		initialValues: Record<string, unknown>;
	}) {
		super({
			label: 'Field Specification',
			factory,
			params: { initialValues },
			// height: 340,
			xmlConfig: {
				xmlTag: 'FieldSpecification',
				outData: {
					name: 'fieldSpecification',
					displayName: 'Field Specification',
					type: 'fieldSpecification'
				},
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
			}
		});
	}
}
