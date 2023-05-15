import { ClassicPreset } from 'rete';

export class Socket extends ClassicPreset.Socket {
	public readonly isArray: boolean;
	public readonly isRequired: boolean;

	constructor(name: string, { isArray = false, isRequired = false } = {}) {
		super(name);
		this.isArray = isArray;
		this.isRequired = isRequired;
	}
}
