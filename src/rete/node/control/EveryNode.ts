import { _ } from 'svelte-i18n';
import { Node } from '../Node';
import type { NodeFactory } from '../NodeFactory';

export class EveryNode extends Node {
	current = 0;
	// state: { current: number } = { current: 0 };

	constructor({ count = 100, factory }: { count?: number; factory: NodeFactory }) {
		super({ label: 'Every', factory, height: 200, width: 200, params: { count } });

		this.addInExec();
		this.addInExec('reset', 'Reset');
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
					label: 'Count',
					change: (value: number) => {
						console.log("yo")
						this.factory.pythonDataflowEngine.reset(this.id);
					}

				}
			}
		});
		// TODO: change init into getter
		this.pythonComponent.addInitCode(
			`$(every${this.getData<'number'>('count')}) = Every(${this.getData<'number'>('count')})`
		)
		// TODO : dynamic variable
		this.pythonComponent.addVariable(`every${this.getData<'number'>('count')}`)

		this.pythonComponent.setCodeTemplateGetter(() => {
			return (
				`
if $(every${this.getData<'number'>('count')})():
    {exec}?
`
			)
		})
		this.pythonComponent.setCodeTemplateGetter(() => {
			return `$(every${this.getData<'number'>('count')}).reset()`
		}, 'reset')

		this.pythonComponent.addClass(
			`
class Every:
	def __init__(self, count):
		self.count = count
		self.current = 0

	def __call__(self):
		self.current += 1
		return (self.current - 1) % self.count == 0

	def reset(self):
		self.current = 0

`
		)

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
		if (input === 'exec') {
			if (this.isFlowing()) {
				forward('exec');
			}

			this.current++;
		};

		if (input === 'reset') {
			this.current = 0;
		}
		super.execute(input, forward, false);
	}

	override getNaturalFlow(): string | undefined {
		return this.isFlowing() ? 'exec' : undefined;
	}
}
