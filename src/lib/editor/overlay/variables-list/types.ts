import type { SocketType } from '$rete/plugin/typed-sockets';
import type { UUID } from 'crypto';

export type Variable = {
	name: string;
	value: unknown;
	type: SocketType;
	id: string;
};
