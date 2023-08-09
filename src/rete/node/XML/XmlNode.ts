import { Node, type NodeParams, type OutDataParams } from '../Node';
import type { XmlAttribute, XmlAttributeDefinition } from './types';
import { camlelcaseize, titlelize } from '../../../utils/string';
import type { Socket } from '../../socket/Socket';
import type { SocketType, XMLAttrType } from '$rete/plugin/typed-sockets';
import { XMLData } from './XMLData';
import type { InputControl } from '$rete/control/Control';
import { assignControl } from '$rete/customization/utils';

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
		xmlNodeParams.params = { ...xmlNodeParams.params, xmlConfig, initialValues, label: xmlNodeParams.label, noName: xmlConfig.noName }
		console.log("xmlNodeParams", xmlNodeParams)
		const { outData, xmlProperties, childTypes = [] } = xmlConfig;
		const { noName = false } = xmlConfig;
		super({ ...xmlNodeParams, width: 220, height: 40 });

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
				this.addInAttribute({ name, type, isArray, controlType, required, pattern, initialValues });

			});


		// Add XML element inputs
		this.addXmlInData({
			name: 'children',
			isArray: true,
			type: `xmlElement:${childTypes.join('|')}`,
		})

		// Add XML output
		if (outData) {
			this.addOutData({
				name: 'value',
				displayName: '',
				socketLabel: outData.socketLabel,
				type: outData.type
			});
			this.height += 45;
			}
	}

	override applyState(): void {
		const { attributeValues } = this.state;
		for (const [key, value] of Object.entries(attributeValues)) {
			(this.inputs[key]?.control as InputControl)?.setValue(value);
		}
	}

	addInAttribute({ name, type, isArray, controlType, required, pattern, initialValues = {} }: XmlAttributeDefinition & { initialValues?: Record<string, unknown>}) {
		if (name.toLowerCase() === 'name') return;
		if (!required) return;
		this.xmlProperties.add(name);

		const xmlTypePattern = /([^\W_]+)(?:_([^\W_]+))?/gm;
		const [, xmlType, xmlSubType] = xmlTypePattern.exec(type) || [];
		if (xmlType.startsWith('real')) {
			type = xmlSubType && xmlSubType.endsWith('2d') ? 'vector' : 'number';
			controlType = assignControl(type);
		} else if (xmlType.startsWith('R1Tensor')) {
			type = 'vector'
			controlType = assignControl(type)
		}
		else if (xmlType === 'string') {
			type = 'string';
		} else {
			`xmlAttr:${type}`
		}
		isArray = xmlSubType && xmlSubType.startsWith('array') || isArray;

		if (type === 'vector') this.xmlVectorProperties.add(name);
		let control = undefined;
		switch (type) {

		}
		const {control: attrInputControl} = this.addInData({
			name: name,
			displayName: titlelize(name),
			socketLabel: titlelize(name),
			type: type as SocketType,
			isArray: isArray,
			control: isArray ? undefined : controlType && {
				type: controlType,
				options: {
					label: titlelize(name),
					initial: initialValues[name],
					pattern: pattern,
					debouncedOnChange: (value) => {
						console.log("debouncedOnChange", value)
						this.state.attributeValues[name] = value;
						this.getDataflowEngine().reset(this.id);
					}
				}
			}
		});
		if (attrInputControl) {
			console.log("attrInputControl", attrInputControl)
			const val = (attrInputControl as InputControl).value;
			if (val !== undefined) {
			this.state.attributeValues[name] = val;
			setTimeout(() => {
				this.getDataflowEngine().reset(this.id);

			})
			
			}
		}

		this.height += isArray ? 37 : 67;
	}

	override data(inputs?: Record<string, unknown>): { value: XMLData } {
		let children: XMLData[] = [];
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
					children = [...children, ...data instanceof Array ? data : [data]]
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
		console.log(this.xmlProperties)
		const isArray = (key: string) => (this.inputs[key]?.socket as Socket).isArray;
		for (const key of this.xmlProperties) {
			console.log(key)
			let data = this.getData(key, inputs) as Record<string, unknown> | Array<Record<string, unknown>>;
			if (data !== undefined) {
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
		console.log(properties)
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
		this.height += 37;
	}
}
