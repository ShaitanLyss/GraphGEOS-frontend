interface IMenuItem {
	getLabel: () => string;
	getDescription: () => string;
	getType: () => MenuItemType;
	getTags: () => string[];
}

enum MenuItemType {
	Node,
	Action
}

// interface INodeMenuItem extends IMenuItem

// const a: IMenuItem = { description: 'a', label: 'a' };
