import { ContextMenuPlugin, Presets } from 'rete-context-menu-plugin';
import type { Schemes } from '../../node/Schemes';
import type { AreaPlugin } from 'rete-area-plugin';
import type { AreaExtra } from '../../node/AreaExtra';
import { Node } from '../../node/Node';
import { capitalize } from '../../../utils/string';
import { Setup } from '../../setup/Setup';
import type { NodeEditor } from '../../NodeEditor';
import type { NodeFactory } from '../../node/NodeFactory';
import { GetXmlSchema, GetXmlSchemaStore } from '$houdini';
import { XmlNode } from '$rete/node/xml/XmlNode';
import { XmlProperty, XmlPropertyDefinition } from '$rete/node/xml/types';

type Entry = Map<string, Entry | (() => Node | Promise<Node>)>;
function isClassConstructor(obj: unknown): boolean {
	return typeof obj === 'function' && !!obj.prototype && !!obj.prototype.constructor;
}

function pushMenuItem(
	items: Entry,
	prefix: string[],
	item: typeof Node | (() => Node | Promise<Node>),
	factory: NodeFactory
): void {
	if (prefix.length == 1) {
		// check if item is a node class
		// if so, add it to the menu
		// otherwise, add it as a function

		items.set(
			prefix[0].split('.')[0],
			isClassConstructor(item)
				? () => new (item as typeof Node)({ factory: factory })
				: (item as () => Node | Promise<Node>)
		);
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
		for (const [path, module] of Object.entries(modules)) {
			const objects = await module();
			const menuPath = path.slice('../../node/'.length);

			// for (const file of nodeFiles) {
			// 	const objects = await import(/* @vite-ignore */ `../../node/${file}`);

			const nodeClasses: (typeof Node)[] = Object.values(objects).filter((value: unknown) => {
				const prototype = (value as { prototype }).prototype;

				return (
					prototype instanceof Node &&
					prototype.constructor &&
					!Object.prototype.hasOwnProperty.call(prototype.constructor, '__isAbstract') &&
					!Object.prototype.hasOwnProperty.call(prototype.constructor, 'hidden')
				);
			}) as (typeof Node)[];

			nodeClasses.forEach((node) => pushMenuItem(items, menuPath.split(re), node, factory));

			// console.log(nodeClasses);

			// items.push([file, () => new node()]);
		}

		const xmlSchema = (await new GetXmlSchemaStore().fetch()).data?.geos.xmlSchema;
		if (xmlSchema) {
			for (const complexType of xmlSchema.complexTypes) {
				const name = complexType.name.match(/^(.*)Type$/)?.at(1);
				if (!name) throw new Error(`Invalid complex type name: ${complexType.name}`);
				pushMenuItem(
					items,
					['xml_auto', complexType.name],
					() =>
						new XmlNode({
							label: name,
							factory,
							xmlConfig: {
								xmlTag: name,

								xmlProperties: complexType.attributes.map<XmlPropertyDefinition>((attr) => {
									return {
										name: attr.name,
										type: attr.type,
										controlType: 'text'
									};
								})
							}
						}),
					factory
				);
			}
		}
		const contextMenu = new ContextMenuPlugin<Schemes>({
			items: Presets.classic.setup(getMenuArray(items))
		});

		area.use(contextMenu);
	}
}
