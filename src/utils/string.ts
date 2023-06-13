export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titlelize(str: string): string {
	return str.split(/(?=[A-Z])/).map(capitalize).join(' ');
}
