import { Socket } from '../../socket/Socket';
import { Node } from '../Node';
import { type  XmlData } from './types';

export class GetNameNode extends Node<{ xml: Socket }, { name: Socket }> {
	constructor() {
		super('GetName');
		this.addInData({
			name: 'xml',
			displayName: 'XML',
			socketLabel: 'XML',
			type: 'any'
		});
		this.addOutData({
			name: 'name',
			displayName: 'Name',
			socketLabel: 'Name',
			type: 'string'
		});
	}

	override data(inputs?: Record<string, unknown>): { name: string } {
		const xml = this.getData('xml', inputs) as XmlData;

		return { name: xml?.name };
	}
}
