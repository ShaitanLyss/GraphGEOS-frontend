import { writable } from "svelte/store";


export const moonMenuPositionStore = writable<{x: number, y:number}>({x: 500, y: 500});
export const moonMenuVisibleStore = writable<boolean>(false);
export const moonMenuDropConnectionStore = writable<() => void>(() => {});
export const moonMenuHideDelayStore = writable<number>(100);

export function spawnMoonMenu({pos, drop} : {pos: {x: number, y: number}, drop: () => void}) {
    moonMenuDropConnectionStore.set(drop);
    moonMenuPositionStore.set(pos);
    moonMenuVisibleStore.set(true);
}