import { _ } from 'svelte-i18n';
import { Node, NodeParams } from '../Node';
import { NodeFactory } from '../NodeFactory';

export class EveryNode extends Node {
	private current = 0;

	constructor({ count = 100, factory }: { count?: number; factory: NodeFactory }) {
		super({ label: 'Every', factory, height: 200, width: 200, params: { count } });

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
					initial: count,
					label: 'Count'
				}
			}
		});

		// this.addInExec('reset', 'Reset');
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

	override getNaturalFlow(): string | undefined {
		return this.isFlowing() ? 'exec' : undefined;
	}
}
