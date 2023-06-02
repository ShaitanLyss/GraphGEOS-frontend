import { SolverAPINode } from './SolverAPINode';

export class UpdateSourcesAndReceiversNode extends SolverAPINode {
	constructor() {
		super(
			'Update Sources and Receivers',
			'http://localhost:3000/api/v1/solver/update_source_receivers',
			{
				height: 300,
				width: 180
			}
		);

		this.addInData({
			name: 'sourceCoords',
			displayName: 'Source Coords',
			socketLabel: 'Sources Coords',
			type: 'pythonObject'
		});
		this.addInData({
			name: 'receiverCoords',
			displayName: 'Receiver Coords',
			socketLabel: 'Receivers Coords',
			type: 'pythonObject'
		});
	}
}
