import { Node } from '../Node';

export class EveryNode extends Node {
	current = 0;

	constructor() {
		super('Every', { height: 200, width: 200 });
		this.addInExec();
		this.addOutExec();
		this.addInData({
			name: 'count',
			displayName: 'Count',
			socketLabel: 'Count',
			type: 'number',
			control: {
				type: 'number',
				options: {
					initial: 100,
					label: 'Count'
				}
			}
		});
	}

	isFlowing() {
		const count = this.getData<'number'>('count');
		if (count === undefined) return true;
		return this.current % count === 0;
	}

	override async execute(
		input: string,
		forward: (output: string) => unknown,
		forwardExec?: boolean
	): Promise<void> {
		if (this.isFlowing()) {
			forward('exec');
		}

		this.current++;
		super.execute(input, forward, false);
	}
}
