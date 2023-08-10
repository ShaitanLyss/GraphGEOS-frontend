import { ContextMenuPlugin, Presets } from 'rete-context-menu-plugin';
import type { Schemes } from '../../node/Schemes';
import type { AreaPlugin } from 'rete-area-plugin';
import type { AreaExtra } from '../../node/AreaExtra';
import { Node } from '../../node/Node';
import { capitalize } from '../../../utils/string';
import { Setup } from '../../setup/Setup';
import type { NodeEditor } from '../../NodeEditor';
import type { NodeFactory } from '../../node/NodeFactory';
import { GetXmlSchemaStore } from '$houdini';
import { XmlNode } from '$rete/node/XML/XmlNode';
import type { XmlAttributeDefinition } from '$rete/node/XML/types';
import type { SocketType } from '../typed-sockets';
import { moonMenuItemsStore, type MoonMenuItem } from '$lib/context-menu/moonContextMenu';
import { GetNameNode } from '$rete/node/XML/GetNameNode';
import { MakeArrayNode } from '$rete/node/data/MakeArrayNode';

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
			const moonItems: MoonMenuItem[] = [];
			const complexTypesWithName: string[] = [];
			const complexTypes: string[] = [];
			for (const complexType of xmlSchema.complexTypes) {
				const name = complexType.name.match(/^(.*)Type$/)?.at(1);
				if (!name) throw new Error(`Invalid complex type name: ${complexType.name}`);

				const hasNameAttribute = complexType.attributes.some((attr) => attr.name === 'name');
				if (hasNameAttribute) complexTypesWithName.push(name);
				complexTypes.push(name);

				const xmlNodeAction: (factory: NodeFactory) => Node = () =>
					new XmlNode({
						label: name,
						factory,

						xmlConfig: {
							noName: !hasNameAttribute,
							childTypes: complexType.childTypes.map((childType) => {
								const childName = childType.match(/^(.*)Type$/)?.at(1);
								if (!childName) return childType;
								return childName;
							}),
							xmlTag: name,
							outData: {
								name: name,
								type: `xmlElement:${name}`,
								socketLabel: name
							},

							xmlProperties: complexType.attributes.map<XmlAttributeDefinition>((attr) => {
								return {
									name: attr.name,
									required: attr.required,
									pattern: attr.pattern,
									type: attr.type,
									controlType: 'text'
								};
							})
						}
					});

				moonItems.push({
					label: name,
					outType: name,
					inChildrenTypes: complexType.childTypes.map((childType) => {
						const childName = childType.match(/^(.*)Type$/)?.at(1);
						if (!childName) return childType;
						return childName;
					}),
					action: xmlNodeAction
				});
				pushMenuItem(items, ['XML', complexType.name], () => xmlNodeAction(factory), factory);
			}
			const getNameNodeItem: MoonMenuItem = {
				action: (factory) => new GetNameNode({ factory }),
				inChildrenTypes: complexTypesWithName,
				label: 'Get Name',
				outType: 'string'
			};
			const makeArrayNodeItem: MoonMenuItem = {
				action: (factory) => new MakeArrayNode({ factory }),
				inChildrenTypes: ['*'],
				label: 'Make Array',
				outType: '*'
			};
			moonMenuItemsStore.set([getNameNodeItem, makeArrayNodeItem, ...moonItems]);
		}

		const contextMenu = new ContextMenuPlugin<Schemes>({
			items: Presets.classic.setup(getMenuArray(items))
		});

		area.use(contextMenu);
	}
}
