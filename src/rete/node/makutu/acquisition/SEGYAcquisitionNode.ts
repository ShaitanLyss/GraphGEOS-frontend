import { APINode } from '../../APINode';

export class SEGYAcquisitionNode extends APINode {
	constructor() {
		super('SEGY Acquisition', { url: 'http://localhost:3000/api/v1/acquisition/segy' });
		this.addInData({
			name: 'segdir',
			displayName: 'Seg Directory',
			type: 'string',
			control: {
				type: 'text',
				options: {
					initial: 'acquisition/'
				}
			}
		});
		this.addOutData({
			name: 'shots',
			displayName: 'Shots',
			type: 'pythonObject',
			isArray: true
		});
	}

	override data(inputs?: Record<string, unknown> | undefined): { shots: unknown[] } {
		return { shots: [] };
	}
}
