import { XmlNode } from './XmlNode';
import type { NodeFactory } from '../NodeFactory';

/**
 * This node displays the value of the input.
 */
export class ProblemNode extends XmlNode {
	width = 180;

	constructor({factory}: {factory: NodeFactory}) {
		super({label: 'Problem', factory, height:340,  xmlConfig: { xmlTag: 'Problem'} });

		this.addInData({
			name: 'mesh',
			displayName: 'Mesh',
			socketLabel: 'Mesh',
			type: 'mesh'
		});

		this.addInData({
			name: 'geometry',
			displayName: 'Geometry',
			socketLabel: 'Geometry',
			isArray: true,
			type: 'geometry'
		});

		this.addInData({
			name: 'numericalMethods',
			displayName: 'Numerical Methods',
			socketLabel: 'Numerical Methods',
			isArray: true,
			type: 'numericalMethod'
		});

		this.addInData({
			name: 'elementRegions',
			displayName: 'Element Regions',
			socketLabel: 'Element Regions',
			isArray: true,
			type: 'elementRegion'
		});

		this.addInData({
			name: 'constitutive',
			displayName: 'Constitutive',
			socketLabel: 'Constitutive',
			isArray: true,
			type: 'constitutive'
		});

		// Setup input
		this.addInData({
			name: 'solver',
			displayName: 'Solver',
			socketLabel: 'Solver',
			isArray: true,
			type: 'string'
		});

		// this.addInData({

		this.addInData({
			name: 'fieldSpecifications',
			displayName: 'Field Specifications',
			socketLabel: 'Field Specifications',
			isArray: true,
			type: 'fieldSpecification'
		});

		this.addInData({
			name: 'outputs',
			displayName: 'Outputs',
			socketLabel: 'Outputs',
			isArray: true,
			type: 'output'
		});
	}
}
