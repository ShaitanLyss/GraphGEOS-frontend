import { ClassicPreset } from 'rete';
import type { Socket } from './socket/Socket';

export class Input<S extends Socket=Socket> extends ClassicPreset.Input<S> {
	public readonly isRequired: boolean;
	constructor(
		socket: S,
		label?: string,
		multipleConnections?: boolean,
		{ isRequired = false } = {}
	) {
		super(socket, label, multipleConnections);
		this.isRequired = isRequired;
	}
}
