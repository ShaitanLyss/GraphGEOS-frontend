import { XmlNode } from './XmlNode';
import type { NodeFactory } from '../NodeFactory';
import { ButtonControl } from '$rete/control/button/button';

/**
 * This node displays the value of the input.
 */
export class ProblemNode extends XmlNode {
	width = 180;

	constructor({ factory }: { factory: NodeFactory }) {
		super({
			label: 'Problem', factory,
			xmlConfig: {
				noName: true,
				xmlTag: 'Problem',
				outData: {
					name: 'problem',
					displayName: 'Problem',
					type: 'xmlProblem'
				},
			}
		});

		this.addXmlInData({
			name: 'mesh',
			tag: 'Mesh',
			// displayName: 'Mesh',
			// socketLabel: 'Mesh',
			type: 'mesh'
		});

		this.addXmlInData({
			name: 'geometry',
			tag: 'Geometry',
			// displayName: 'Geometry',
			// socketLabel: 'Geometry',
			isArray: true,
			type: 'geometry'
		});

		this.addXmlInData({
			name: 'numericalMethods',
			tag: 'NumericalMethods',
			// displayName: 'Numerical Methods',
			// socketLabel: 'Numerical Methods',
			isArray: true,
			type: 'numericalMethod'
		});

		this.addXmlInData({
			name: 'elementRegions',
			tag: 'ElementRegions',
			// displayName: 'Element Regions',
			// socketLabel: 'Element Regions',
			isArray: true,
			type: 'elementRegion'
		});

		this.addXmlInData({
			name: 'constitutive',
			tag: 'Constitutive',
			// displayName: 'Constitutive',
			// socketLabel: 'Constitutive',
			isArray: true,
			type: 'constitutive'
		});

		// Setup input
		this.addXmlInData({
			name: 'solver',
			tag: 'Solver',
			// displayName: 'Solver',
			// socketLabel: 'Solver',
			isArray: true,
			type: 'string'
		});

		// this.addInData({

		this.addXmlInData({
			name: 'fieldSpecifications',
			tag: 'FieldSpecifications',
			// displayName: 'Field Specifications',
			// socketLabel: 'Field Specifications',
			isArray: true,
			type: 'fieldSpecification'
		});

		this.addXmlInData({
			name: 'outputs',
			tag: 'Outputs',
			// displayName: 'Outputs',
			// socketLabel: 'Outputs',
			isArray: true,
			type: 'output'
		});
	}
}
