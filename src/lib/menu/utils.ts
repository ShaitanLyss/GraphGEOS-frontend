import type { IMenuItem, MenuItemQuery, QueriableMenuItem } from './types';

export function filterMenuItems({
	menuItems,
	filter,
	allowMissingKey = true,
	verifyAll = true
}: {
	menuItems: QueriableMenuItem[];
	filter: MenuItemQuery;
	allowMissingKey?: boolean;
	verifyAll?: boolean;
}): QueriableMenuItem[] {
	return menuItems.filter((menuItem) => {
		const queries = Object.entries(filter);

		return (verifyAll ? Array.prototype.every : Array.prototype.some).call(
			queries,
			([key, filter_value]) => {
				let isGetter = false;
				if (!(key in menuItem)) {
					isGetter = true;
					key = 'get' + key[0].toUpperCase() + key.slice(1);
				}

				if (!(key in menuItem)) return allowMissingKey;

				let item_value: unknown;
				if (isGetter) {
					const tmp = menuItem[key as keyof Omit<QueriableMenuItem, 'type'>];
					if (typeof tmp !== 'function') throw new Error(`Property ${key} is not a getter`);
					item_value = tmp();
				} else {
					item_value = menuItem[key as keyof QueriableMenuItem];
				}

				if (typeof filter_value !== typeof item_value) return false;

				if (typeof filter_value === 'string') {
					const test_string = (item_value as string).toLowerCase();
					return test_string.includes(filter_value.toLowerCase());
				} else if (Array.isArray(filter_value) && Array.isArray(item_value)) {
					const test_array = (item_value as unknown[]).map((value) =>
						typeof value === 'string' ? value.toLowerCase() : value
					);
					return filter_value.some((value) =>
						test_array.includes(typeof value === 'string' ? value.toLowerCase() : value)
					);
				} else {
					return filter_value === item_value;
				}
			}
		);
	});
}
