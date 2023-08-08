import { Node, type NodeParams, type OutDataParams } from '../Node';
import type { XmlProperty, XmlPropertyDefinition } from './types';
import { camlelcaseize, titlelize } from '../../../utils/string';
import type { Socket } from '../../socket/Socket';
import type { SocketType } from '$rete/plugin/typed-sockets';
import { XMLData } from './XMLData';

export type XmlNodeParams = NodeParams & {
	xmlConfig: {
		noName?: boolean;
		xmlTag: string;
		outData?: OutDataParams;
		xmlProperties?: XmlPropertyDefinition[];
	};
	params?: {
		initialValues?: Record<string, unknown>;
	};
};

export  class XmlNode extends Node<Record<string, Socket>, { value: Socket }> {
	// static __isAbstract = true;
	static hidden = true;
	static counts: Record<string, bigint> = {};
	name?: string;
	xmlTag: string;
	xmlInputs: Record<string, { tag?: string }> = {};
	xmlProperties: Set<string> = new Set();
	xmlVectorProperties: Set<string> = new Set();

	constructor(xmlNodeParams: XmlNodeParams) {
		let initialValues = xmlNodeParams.params?.initialValues;
		const config = xmlNodeParams.xmlConfig;
		const { outData, xmlProperties } = config;
		const { noName = false } = config;
		super(xmlNodeParams);

		if (!noName) {
			let name = xmlNodeParams.label;
			name = name !== undefined ? name : '';
			XmlNode.counts[name] = XmlNode.counts[name] ? XmlNode.counts[name] + BigInt(1) : BigInt(1);
			this.name = camlelcaseize(name) + XmlNode.counts[name];
		}
		this.xmlTag = config.xmlTag;
		// console.log(this.name);

		// this.name = name + XmlNode.count;
		initialValues = initialValues !== undefined ? initialValues : {};

		if (xmlProperties)
			xmlProperties.forEach(({ name, type, isArray, controlType }) => {
				this.xmlProperties.add(name);
				if (type === 'vector') this.xmlVectorProperties.add(name);

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

	override data(inputs?: Record<string, unknown>): { value: XMLData } {
		const children = [];
		for (const [key, { tag }] of Object.entries(this.xmlInputs)) {
			const data = this.getData(key, inputs);
			if (data) {
				if (tag) {
					const childChildren: Array<XMLData> = data instanceof Array ? data : [data];

					children.push(
						new XMLData({
							tag: tag,
							children: childChildren,
							properties: {}
						})
					);
				} else {
					children.push(data);
				}
			}
		}

		const xmlData = new XMLData({
			tag: this.xmlTag,
			children: children,
			name: this.name,
			properties: this.getProperties(inputs)
		});
		// console.log(xmlData);

		return { value: xmlData };
	}

	getProperties(inputs?: Record<string, unknown>): Record<string, unknown> {
		const properties: Record<string, unknown> = {};
		const isArray = (key: string) => (this.inputs[key]?.socket as Socket).isArray;
		for (const key of this.xmlProperties) {
			let data = this.getData(key, inputs);
			if (data) {
				if (isArray(key) && !(data instanceof Array)) {
					data = [data];
				}
				if (this.xmlVectorProperties.has(key)) {
					if (isArray(key)) {
						properties[key] = (data as Array<Record<string, number>>).map((value) =>
							Object.values(value)
						);
					} else properties[key] = Object.values(data);
				} else {
					properties[key] = data;
				}
			}
		}
		return properties;
	}

	addXmlInData({
		name,
		tag,
		type = 'any',
		isArray = false
	}: {
		name: string;
		tag?: string;
		type?: SocketType;
		isArray?: boolean;
	}) {
		this.xmlInputs[name] = { tag: tag };
		this.addInData({
			name: name,
			displayName: titlelize(name),
			socketLabel: titlelize(name),
			type: type,
			isArray: isArray
		});
		this.height += 45;
	}
}
