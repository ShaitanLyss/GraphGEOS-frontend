import { ClassicPreset } from 'rete';
import { Node, NodeParams } from '../Node';

interface AppendNodeParams extends NodeParams {
	a: string;
	b: string;
	sep: string;
}

export class AppendNode extends Node {
	constructor({ a = '', sep = ' ', b = '' } = {}) {
		super('Append', { height: 200 });
		this.addInData({
			name: 'a',
			displayName: 'A',
			type: 'any',
			withControl: true,
			initial: a
		});
		this.addInData({
			name: 'sep',
			displayName: 'Separator',
			type: 'string',
			withControl: true,
			initial: sep
		});
		this.addInData({
			name: 'b',
			displayName: 'B',
			type: 'any',
			withControl: true,
			initial: b
		});
		this.addOutData({
			name: 'result',
			type: 'string'
		});
	}
	override data(
		inputs?: Record<string, unknown[]> | undefined
	): Record<string, unknown> | Promise<Record<string, unknown>> {
		const res = { result: '' };
		if (!inputs) return { ...super.data(inputs), res };

		const aControl = this.inputs.a?.control as ClassicPreset.InputControl<'text'>;
		const bControl = this.inputs.b?.control as ClassicPreset.InputControl<'text'>;
		const sepControl = this.inputs.sep?.control as ClassicPreset.InputControl<'text'>;

		const { a, b, sep } = inputs;
		const aValue = a ? a[0] : aControl.value;
		const bValue = b ? b[0] : bControl.value;
		const sepValue = sep ? sep[0] : sepControl.value;

		// console.log("" + aValue + sepValue + bValue);

		return {
			...super.data(inputs),
			result: '' + aValue + sepValue + bValue
		};
	}
}
