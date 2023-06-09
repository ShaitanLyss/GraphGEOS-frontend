import { APINode } from '../../APINode';

export class SEGYAcquisitionNode extends APINode {
	constructor() {
		super('SEGY Acquisition', { url: '/makutu/acquisition/segy' });
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

		// setInterval(() => {
		// 	console.log(this.get);
			
		// });
	}
}
