import { ContextMenuPlugin, Presets } from 'rete-context-menu-plugin';
import { AddNode } from '../../node/math/AddNode';
import { NumberNode } from '../../node/math/NumberNode';
import { DisplayNode } from '../../node/math/DisplayNode';
import type { Schemes } from '../../node/Schemes';
import type { AreaPlugin } from 'rete-area-plugin';
import type { AreaExtra } from '../../node/AreaExtra';
import { Node } from '../../node/Node';
import { capitalize } from '../../../utils/string';

type Entry = Map<string, Entry | (() => Node | Promise<Node>)>;

function pushMenuItem(items: Entry, prefix: string[], item: typeof Node): void {
	if (prefix.length == 1) {
		items.set(prefix[0].split('.')[0], () => new item());
	} else {
		const entry = prefix[0];
		if (!items.has(entry)) {
			items.set(entry, new Map<string, Entry>());
		}
		pushMenuItem(items.get(entry) as Map<string, Entry>, prefix.slice(1, prefix.length), item);
	}
}

function getMenuArray(items: Map<string, Entry>) {
	// console.log(items);

	return [...items.entries()].map(([key, value], i) => {
		const map = value as Map<string, Entry>;

		if (value instanceof Function) {
			return [capitalize(key.slice(0, -4)), value];
		} else return [capitalize(key), getMenuArray(map)];
	});
}

export async function setupContextMenu(area: AreaPlugin<Schemes, AreaExtra>) {
	const response = await fetch('/menu');
	const nodeFiles = await response.json();
	const re = /[/\\]/i;

	// console.log(nodeFiles);
	const items = new Map<string, Entry>();
	for (const file of nodeFiles) {
		const objects = await import(/* @vite-ignore */ `../../node/${file}`);

		Object.values(objects)
			.filter((value: unknown) => {
				const prototype = (value as { prototype }).prototype;

				return (
					prototype instanceof Node &&
					prototype.constructor &&
					!Object.prototype.hasOwnProperty.call(prototype.constructor, '__isAbstract')
				);
			})
			.forEach((node) => pushMenuItem(items, file.split(re), node as typeof Node));

		// items.push([file, () => new node()]);
	}

	const contextMenu = new ContextMenuPlugin<Schemes>({
		items: Presets.classic.setup(getMenuArray(items))
	});

	area.use(contextMenu);
}
