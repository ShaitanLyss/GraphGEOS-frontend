import { XmlNode } from './XmlNode';
import { Socket } from '../../socket/Socket';
import { Input } from '../../Input';

/**
 * This node displays the value of the input.
 */
export class ProblemNode extends XmlNode {
	width = 180;

	constructor() {
		super('Problem', { height: 340, xmlTag: 'Problem' });

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
