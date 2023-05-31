import { Node } from '../Node';
import { ButtonControl } from '../../control/button/button';
import { Input } from '../../Input';
import { Socket } from '../../socket/Socket';

export class MakeArrayNode extends Node {
	constructor() {
		super('Make Array', { height: 160, width: 150 });
		this.addOutData({ name: 'array', isArray: true, type: 'any' });
		this.addInData({ name: 'data-0' });
		this.addControl('addPinBtn', new ButtonControl('+', this.addPin));
	}

	override data(
		inputs?: Record<string, Input<Socket>> | undefined
	): Record<string, unknown> | Promise<Record<string, unknown>> {
		const data: undefined | unknown[] = [];
		console.log('Make array data', data);
		for (const key in inputs) {
			data.push(inputs[key][0]);
		}

		return { data };
	}

	addPin() {
		console.log('Adding input pin with key data-' + Object.keys(this.inputs).length);

		this.addInData({
			name: `data-${Object.keys(this.inputs).length}`,
			displayName: '',
			isArray: false,
			type: 'any'
		});
		this.height += 36;
		this.updateElement('node', this.id);
		this.processDataflow();
	}
}
