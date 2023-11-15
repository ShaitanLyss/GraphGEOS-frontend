import { describe, it, expect } from 'vitest';
import { filterMenuItems } from '$lib/menu/utils';
import { MenuItemType, QueriableMenuItem, createQueriableMenuItem } from '$lib/menu/types';

// check test case are careful about items being the same object
it('should return false for two distinct objects albeit similar', () => {
	const menuItems = [
		{
			label: 'Test Label',
			description: 'Test Description',
			tags: ['tag1', 'tag2'],
			menuPath: ['menu', 'path'],
			type: MenuItemType.Node
		},
		{
			label: 'Test Label',
			description: 'Test Description',
			tags: ['tag1', 'tag2'],
			menuPath: ['menu', 'path'],
			type: MenuItemType.Node
		}
	].map(createQueriableMenuItem);

	expect(menuItems[0] === menuItems[1]).toBeFalsy();
});

describe('filterMenuItems', () => {
	it('should return an empty array if no menu items are provided', () => {
		const filteredMenuItems = filterMenuItems({ menuItems: [], filter: {} });
		expect(filteredMenuItems).toEqual([]);
	});
	it('should return all menu items if no filter is provided', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Base
			},
			{
				label: 'Test Label 2',
				description: 'Test Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Base
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({ menuItems, filter: {} });
		expect(filteredMenuItems).toEqual(menuItems);
	});
	it('should return menu items with the type specified by filter', () => {
		const menuItems = [
			createQueriableMenuItem({
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			}),
			createQueriableMenuItem({
				label: 'Test Label 2',
				description: 'Test Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action,
				executeAction: () => undefined
			})
		];

		const filteredMenuItems = filterMenuItems({ menuItems, filter: { type: MenuItemType.Node } });
		expect(filteredMenuItems).toEqual([menuItems[0]]);
	});
	it('should return menu items with the label containing the query label', () => {
		const menuItems: QueriableMenuItem[] = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			},
			{
				label: 'Test Label 2',
				description: 'Test Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({ menuItems, filter: { label: 'Test Label' } });
		expect(filteredMenuItems).toEqual(menuItems.slice(0, 2));
	});
	it('should return menu items with the label containing the query label, case insensitive', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			},
			{
				label: 'Test Label 2',
				description: 'Test Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({ menuItems, filter: { label: 'test label' } });
		expect(filteredMenuItems).toEqual(menuItems.slice(0, 2));
	});

	it('should return menu items with the description containing the query description', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({
			menuItems,
			filter: { description: 'Description 2' }
		});
		expect(filteredMenuItems).toEqual(menuItems.slice(1, 3));
	});

	it('should return menu items with the description containing the query description, case insensitive', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({
			menuItems,
			filter: { description: 'description 2' }
		});
		expect(filteredMenuItems).toEqual(menuItems.slice(1, 3));
	});

	it('should return menu items with the tags containing at least one of the query tags', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag2', 'tag3'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag3', 'tag1'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({ menuItems, filter: { tags: ['tag1'] } });
		expect(filteredMenuItems).toEqual([menuItems[0], menuItems[2]]);
	});

	it('should return menu items with the tags containing at least one of the query tags, case insensitive', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag2', 'tag3'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag3', 'tag1'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({ menuItems, filter: { tags: ['TAG1'] } });
		expect(filteredMenuItems).toEqual([menuItems[0], menuItems[2]]);
	});

	it('should return menu items with the tags containing at least one of the query tags, case insensitive in the other direction', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['TAG1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag2', 'tag3'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag3', 'tag1'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({ menuItems, filter: { tags: ['tag1'] } });
		expect(filteredMenuItems).toEqual([menuItems[0], menuItems[2]]);
	});

	it('should return menu items with tags containing at least one of the query tags, multiple matching query tags, case insenstive in both directions', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['TAG1', 'tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag2', 'tag3'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag3', 'tag1'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Action
			},
			{
				label: 'Outsider',
				description: 'Test Description',
				tags: ['tag4', 'tag5'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Base
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({ menuItems, filter: { tags: ['tag1', 'tag2'] } });
		expect(filteredMenuItems).toEqual(menuItems.slice(0, 3));
	});

	it('should return node menu items with the inTypes containing at least one of the query inTypes', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type1', 'type2']
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type3', 'type4']
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag3'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type5', 'type6']
			},
			{
				label: 'Outsider',
				description: 'Test Description',
				tags: ['tag4'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Base
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({
			menuItems,
			filter: { inTypes: ['type1'] },
			allowMissingKey: false
		});
		expect(filteredMenuItems).toEqual([menuItems[0]]);
	});

	it('should return node menu items with the inTypes containing at least one of the query inTypes, keep only nodes by specifying type', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type1', 'type2']
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type3', 'type4']
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag3'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type5', 'type6']
			},
			{
				label: 'Outsider',
				description: 'Test Description',
				tags: ['tag4'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Base
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({
			menuItems,
			filter: { inTypes: ['type1'], type: MenuItemType.Node },
			allowMissingKey: true
		});
		expect(filteredMenuItems).toEqual([menuItems[0]]);
	});

	it('should return node menu items with the inTypes containing at least one of the query inTypes and others menu items without inTypes key', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type1', 'type2']
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type3', 'type4']
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag3'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type5', 'type6', 'type1']
			},
			{
				label: 'Outsider',
				description: 'Test Description',
				tags: ['tag4'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Base
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({ menuItems, filter: { inTypes: ['type1'] } });
		expect(filteredMenuItems).toEqual([menuItems[0], menuItems[2], menuItems[3]]);
	});

	it('should return menu items with label containing a specific string or menu items with outTypes containing a type, test verify all = false', () => {
		const menuItems = [
			{
				label: 'Test Label',
				description: 'Test Description',
				tags: ['tag1'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				inTypes: ['type1', 'type2']
			},
			{
				label: 'Test Label 2',
				description: 'Description 2',
				tags: ['tag2'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				outTypes: ['type3', 'type4']
			},
			{
				label: 'Label',
				description: 'Test Description 2',
				tags: ['tag3'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Node,
				outTypes: ['type5', 'type6', 'type1']
			},
			{
				label: 'Outsider',
				description: 'Test Description',
				tags: ['tag4'],
				menuPath: ['menu', 'path'],
				type: MenuItemType.Base,
				inTypes: ['type1', 'type2']
			}
		].map(createQueriableMenuItem);

		const filteredMenuItems = filterMenuItems({
			menuItems,
			filter: { label: 'Test', outTypes: ['type1'] },
			verifyAll: false,
			allowMissingKey: false
		});
		expect(filteredMenuItems).toEqual([menuItems[0], menuItems[1], menuItems[2]]);
	});
});
