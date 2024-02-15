import type { SocketType } from '$rete/plugin/typed-sockets';

export type Variable = {
	name: string;
	value: unknown;
	type: SocketType;
	localId: string;
};
