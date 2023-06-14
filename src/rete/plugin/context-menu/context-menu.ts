import { ContextMenuPlugin, Presets } from 'rete-context-menu-plugin';
import type { Schemes } from '../../node/Schemes';
import type { AreaPlugin } from 'rete-area-plugin';
import type { AreaExtra } from '../../node/AreaExtra';
import { Node } from '../../node/Node';
import { capitalize } from '../../../utils/string';
import { Setup } from '../../setup/Setup';
import { NodeEditor } from '../../NodeEditor';
import { NodeFactory } from '../../node/NodeFactory';

type Entry = Map<string, Entry | (() => Node | Promise<Node>)>;

function pushMenuItem(
	items: Entry,
	prefix: string[],
	item: typeof Node,
	factory: NodeFactory
): void {
	if (prefix.length == 1) {
		items.set(prefix[0].split('.')[0], () => new item({ factory: factory }));
	} else {
		const entry = prefix[0];
		if (!items.has(entry)) {
			items.set(entry, new Map<string, Entry>());
		}
		pushMenuItem(
			items.get(entry) as Map<string, Entry>,
			prefix.slice(1, prefix.length),
			item,
			factory
		);
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

export class ContextMenuSetup extends Setup {
	async setup(
		editor: NodeEditor,
		area: AreaPlugin<Schemes, AreaExtra>,
		factory: NodeFactory
	): Promise<void> {
		const re = /[/\\]/i;

		// console.log(nodeFiles);
		const items = new Map<string, Entry>();
		const modules = import.meta.glob('../../node/**/*.ts');
		console.log(modules);
		for (const [path, module] of Object.entries(modules)) {
			const objects = await module();
			const menuPath = path.slice('../../node/'.length);

			// for (const file of nodeFiles) {
			// 	const objects = await import(/* @vite-ignore */ `../../node/${file}`);

			Object.values(objects)
				.filter((value: unknown) => {
					const prototype = (value as { prototype }).prototype;

					return (
						prototype instanceof Node &&
						prototype.constructor &&
						!Object.prototype.hasOwnProperty.call(prototype.constructor, '__isAbstract')
					);
				})
				.forEach((node) => pushMenuItem(items, menuPath.split(re), node as typeof Node, factory));

			// items.push([file, () => new node()]);
		}

		const contextMenu = new ContextMenuPlugin<Schemes>({
			items: Presets.classic.setup(getMenuArray(items))
		});

		area.use(contextMenu);
	}
}
