import { Node, type NodeParams, type OutDataParams } from '../Node';
import type { XmlProperty } from './types';
import { camlelcaseize, titlelize } from '../../../utils/string';
import type { Socket } from '../../socket/Socket';

export type XmlNodeParams = NodeParams & {
	xmlConfig: {
	xmlTag: string;
	outData?: OutDataParams;
	xmlProperties?: XmlProperty[];
	};
	params?: {
		initialValues?: Record<string, unknown>;
	}
};

export abstract class XmlNode extends Node<Record<string, Socket>, { value: Socket }> {
	static __isAbstract = true;
	static counts: Record<string, bigint> = {};
	name = '';
	xmlTag: string;

	constructor(xmlNodeParams: XmlNodeParams) {
		let initialValues = xmlNodeParams.params?.initialValues;
		const config = xmlNodeParams.xmlConfig;
		let name = xmlNodeParams.label;
		const { outData, xmlProperties } = config;
		super(xmlNodeParams);
		name = name !== undefined ? name : '';
		XmlNode.counts[name] = XmlNode.counts[name] ? XmlNode.counts[name] + BigInt(1) : BigInt(1);
		this.name = camlelcaseize(name) + XmlNode.counts[name];
		this.xmlTag = config.xmlTag;
		console.log(this.name);

		// this.name = name + XmlNode.count;
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
