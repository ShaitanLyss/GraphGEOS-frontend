import { InDataParams, Node, NodeParams, OutDataParams } from '../Node';
import type { XmlData, XmlProperty } from './types';
import { camlelcaseize, titlelize } from '../../../utils/string';
import type { InputControlTypes } from '../../control/Control';
import type { Socket } from '../../socket/Socket';

export type XmlNodeParams = NodeParams & {
	xmlTag: string;
	outData?: OutDataParams;
	initialValues?: Record<string, unknown>;
	xmlProperties?: XmlProperty[];
};

export abstract class XmlNode extends Node<Record<string, Socket>, { value: Socket }> {
	static __isAbstract = true;
	static counts: Record<string, bigint> = {};
	name = '';
	xmlTag: string;

	constructor(name: string, config: XmlNodeParams) {
		super(name, config);
		XmlNode.counts[name] = XmlNode.counts[name] ? XmlNode.counts[name] + BigInt(1) : BigInt(1);
		this.name = camlelcaseize(name) + XmlNode.counts[name];
		this.xmlTag = config.xmlTag;
		console.log(this.name);

		// this.name = name + XmlNode.count;
		const { outData, xmlProperties } = config;
		let { initialValues } = config;
		initialValues = initialValues !== undefined ? initialValues : {};

		if (xmlProperties)
			xmlProperties.forEach(({ name, type, isArray, controlType }) => {
				this.addInData({
					name: name,
					displayName: titlelize(name),
					socketLabel: titlelize(name),
					type: type,
					isArray: isArray,
					control: controlType && {
						type: controlType,
						options: {
							label: titlelize(name),
							initial: initialValues[name]
						}
					}
				});
				this.height += 45;
			});

		if (outData)
			this.addOutData({
				name: 'value',
				displayName: '',
				socketLabel: outData.socketLabel,
				type: outData.type
			});
	}

	override data(inputs?: Record<string, unknown>): { value: Record<string, unknown> } {
		const res: { value: Record<string, unknown> } = { value: {} };

		for (const key in this.inputs) {
			res['value'][key] = this.getData(key, inputs);
		}

		res['value']['name'] = this.name;
		res['value']['xmlTag'] = this.xmlTag;
		console.log(res['value']);

		return res;
	}
}
