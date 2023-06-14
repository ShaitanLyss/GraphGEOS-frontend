export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titlelize(str: string): string {
	return str
		.split(/(?=[A-Z])/)
		.map(capitalize)
		.join(' ');
}

// remove spaces and capitalize all but first letter
export function camlelcaseize(str: string): string {
	const capitalized = str
		.split(' ')
		.map(capitalize)
		.join('');
	return capitalized.charAt(0).toLowerCase() + capitalized.slice(1);
}
