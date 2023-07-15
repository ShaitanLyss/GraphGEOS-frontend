import { APINode } from '../../APINode';
import type { NodeFactory } from '../../NodeFactory';

export class SEGYAcquisitionNode extends APINode {
	constructor({ factory }: { factory: NodeFactory }) {
		super({ label: 'SEGY Acquisition', factory, url: '/makutu/acquisition/segy' });

		this.pythonComponent.addImportStatement('from utilities.acquisition import SEGYAcquisition');
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
