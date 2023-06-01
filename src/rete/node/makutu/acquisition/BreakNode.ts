import { PythonObject, PythonProperty } from '../../../../backend-interaction/python';
import { Node } from '../../Node';


// TODO : autogenerate outputs from the python object
export class BreakNode extends Node {
	constructor() {
		super('Break Shot');
		this.addInData({
			name: 'object',
			displayName: 'Object',
			inputLabel: 'Shot',
			type: 'pythonObject'
		});

		this.addOutData({
			name: 'xml',
			displayName: 'XML',
			type: 'pythonProperty'
		});
	}

	data(
		inputs?: Record<string, unknown> | undefined
	): Record<string, unknown> | Promise<Record<string, unknown>> {
		if (!inputs) return { xml: undefined };
		const object = inputs.object as PythonObject;
		if (!object) return { xml: undefined };
		return { xml: new PythonProperty(object, 'xml') };
	}
}
