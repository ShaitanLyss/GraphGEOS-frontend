import type { Node, NodeFactory } from '$rete';
import type { ConnectionDropEvent } from '$rete/setup/ConnectionSetup';
import { writable } from 'svelte/store';
import type { IBaseMenuItem } from '../types';

export interface MoonMenuItem {
	label: string;
	inChildrenTypes: string[];
	outType: string;
	action: (factory: NodeFactory) => Node;
}

export const moonMenuPositionStore = writable<{ x: number; y: number }>({ x: 500, y: 500 });
export const moonMenuVisibleStore = writable<boolean>(false);
export const moonMenuDropConnectionStore = writable<() => void>(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
export const moonMenuHideDelayStore = writable<number>(100);
export const moonMenuConnDropEvent = writable<ConnectionDropEvent | null>(null);
export const moonMenuItemsStore = writable<MoonMenuItem[]>([]);
export const newMoonItemsStore = writable<IBaseMenuItem[]>([]);
export const moonMenuFactoryStore = writable<NodeFactory | null>(null);

export function spawnMoonMenu({ connDropEvent }: { connDropEvent: ConnectionDropEvent }) {
	moonMenuConnDropEvent.set(connDropEvent);
	moonMenuDropConnectionStore.set(connDropEvent.drop);
	moonMenuPositionStore.set(connDropEvent.pos);
	moonMenuVisibleStore.set(true);
}
