import { ClassicPreset } from 'rete';
import type { SocketType } from '../plugin/typed-sockets';

export class Socket extends ClassicPreset.Socket {
	public readonly isArray: boolean;
	public readonly isRequired: boolean;
	public readonly type: SocketType;
	public value: unknown;

	constructor(
		{
			name = '',
			isArray = false,
			isRequired = false,
			type = 'any'
		}: { name?: string, isArray?: boolean; isRequired?: boolean; type?: SocketType } = {}
	) {
		super(name);
		this.isArray = isArray;
		this.isRequired = isRequired;
		this.type = type;
	}
}
