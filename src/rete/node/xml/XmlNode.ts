import { Node, type NodeParams, type OutDataParams } from '../Node';
import type { XmlAttribute, XmlAttributeDefinition } from './types';
import { camlelcaseize, titlelize } from '../../../utils/string';
import type { Socket } from '../../socket/Socket';
import type { SocketType, XMLAttrType } from '$rete/plugin/typed-sockets';
import { XMLData } from './XMLData';
import type { InputControl } from '$rete/control/Control';

export type XmlConfig = {
	noName?: boolean;
	xmlTag: string;
	outData?: OutDataParams;
	xmlProperties?: XmlAttributeDefinition[];
	childTypes?: string[];
}

export type XmlNodeParams = NodeParams & {
	xmlConfig: XmlConfig,
	initialValues?: Record<string, unknown>;
};

export class XmlNode extends Node<Record<string, Socket>, { value: Socket }> {
	// static __isAbstract = true;
	static hidden = true;
	static counts: Record<string, bigint> = {};
	name?: string;
	xmlTag: string;
	xmlInputs: Record<string, { tag?: string }> = {};
	xmlProperties: Set<string> = new Set();
	xmlVectorProperties: Set<string> = new Set();
	params: { xmlConfig: XmlConfig } = { ...this.params };
	state: { attributeValues: Record<string, unknown> } = { ...this.state, attributeValues: {}};

	constructor(xmlNodeParams: XmlNodeParams) {
		let { initialValues = {} } = xmlNodeParams;
		const xmlConfig = xmlNodeParams.xmlConfig;
		xmlNodeParams.params = { ...xmlNodeParams.params, xmlConfig, initialValues, label: xmlNodeParams.label }
		console.log("xmlNodeParams", xmlNodeParams)
		const { outData, xmlProperties, childTypes = [] } = xmlConfig;
		const { noName = false } = xmlConfig;
		super({ ...xmlNodeParams, width: 220 });

		if (!noName) {
			let name = xmlNodeParams.label;
			name = name !== undefined ? name : '';
			XmlNode.counts[name] = XmlNode.counts[name] ? XmlNode.counts[name] + BigInt(1) : BigInt(1);
			this.name = camlelcaseize(name) + XmlNode.counts[name];
		}
		this.xmlTag = xmlConfig.xmlTag;
		// console.log(this.name);

		// this.name = name + XmlNode.count;
		initialValues = initialValues !== undefined ? initialValues : {};



		if (xmlProperties)
			xmlProperties.forEach(({ name, type, isArray, controlType, required, pattern }) => {
				if (name.toLowerCase() === 'name') return;
				if (!required) return;
				this.xmlProperties.add(name);
				if (type === 'vector') this.xmlVectorProperties.add(name);

				this.addInData({
					name: name,
					displayName: titlelize(name),
					socketLabel: titlelize(name),
					type: `xmlAttr|${type}` as XMLAttrType,
					isArray: isArray,
					control: controlType && {
						type: controlType,
						options: {
							label: titlelize(name),
							initial: initialValues[name],
							pattern: pattern,
							debouncedOnChange: (value) => {
								this.state.attributeValues[name] = value;
								this.getDataflowEngine().reset(this.id);
							}
						}
					}
				});
				this.height += 45;
			});


		// Add XML element inputs
		for (const childType of childTypes) {
			this.addXmlInData({
				name: childType,
				tag: childType,
				isArray: true,
				type: `xmlElement|${childType}`,
			})
		}

		// Add XML output
		if (outData)
			this.addOutData({
				name: 'value',
				displayName: '',
				socketLabel: outData.socketLabel,
				type: outData.type
			});
	}

	override applyState(): void {
		const { attributeValues } = this.state;
		for (const [key, value] of Object.entries(attributeValues)) {
			(this.inputs[key]?.control as InputControl)?.setValue(value);
		}
	}

	override data(inputs?: Record<string, unknown>): { value: XMLData } {
		const children: XMLData[] = [];
		for (const [key, { tag }] of Object.entries(this.xmlInputs)) {
			const data = this.getData(key, inputs) as XMLData;
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
			let data = this.getData(key, inputs) as Record<string, unknown> | Array<Record<string, unknown>>;
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
