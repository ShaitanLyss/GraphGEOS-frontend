import { ClassicPreset } from 'rete';
import type { SocketType } from '../plugin/typed-sockets';
import type { Node } from '$rete/node/Node';

export class Socket extends ClassicPreset.Socket {
	public readonly isArray: boolean;
	public readonly isRequired: boolean;
	public type: SocketType;
	public value: unknown;
	public selected: boolean;
	public readonly node: Node;

	constructor({
		name = '',
		isArray = false,
		isRequired = false,
		type = 'any',
		node,
	}: { name?: string; isArray?: boolean; isRequired?: boolean; type?: SocketType, node: Node }) {
		super(name);
		this.isArray = isArray;
		this.isRequired = isRequired;
		this.type = type;
		this.selected = false;
		this.node = node;
	}

	select() {
		this.selected = true;
	}

	deselect() {
		this.selected = false;
	}

	toggleSelection() {
		this.selected = !this.selected;
	}
}
