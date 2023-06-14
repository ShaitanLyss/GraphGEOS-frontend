import { PythonObject } from '../../backend-interaction/python';
import { APINode, APINodeParams } from './APINode';

export interface ObjectAPINodeParams extends APINodeParams {
	objectKey: string;
	objectLabel: string;
}

export class ObjectAPINode extends APINode {
	objectKey: string;
	static __isAbstract: boolean;

	constructor(
		name: string,
		{
			url = '',
			objectKey = 'object',
			objectLabel = 'Object',
			height = 235,
			width,
			factory
		}: ObjectAPINodeParams
	) {
		super(name, { url: url, height: height, width: width, factory });
		this.objectKey = objectKey;
		this.addInData({
			name: objectKey,
			displayName: objectLabel,
			socketLabel: objectLabel,
			type: 'pythonObject'
		});
		this.addOutData({
			name: objectKey,
			socketLabel: objectLabel,
			displayName: objectLabel,
			type: 'pythonObject'
		});
	}

	// override data(
	// 	inputs?: Record<string, unknown> | undefined
	// ): Record<string, unknown> | Promise<Record<string, unknown>> {
	// 	const res = {};
	// 	res[this.objectKey] = undefined;
	// 	if (!inputs || inputs[this.objectKey] === undefined) return res;

	// 	res[this.objectKey] = (inputs[this.objectKey] as PythonObject[])[0];

	// 	return res;
	// }
}

// add property __abstract to ObjectAPINode
ObjectAPINode.__isAbstract = true;
