import { getMessageFormatter } from 'svelte-i18n';

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// split on capital letters that are followed by non capital letters or
// preceded by non capital letters
// and join with spaces
export function titlelize(str: string): string {
	return str
		.split(/(?=(?<=[^A-Z])[A-Z])/)

		.map(capitalize)
		.join(' ');
}

// export function titlelize(str: string): string {
// 	return str
// 		.split(/(?=[A-Z])/)
// 		.map(capitalize)
// 		.join(' ');
// }

// remove spaces and capitalize all but first letter
export function camlelcaseize(str: string): string {
	const capitalized = str.split(' ').map(capitalize).join('');
	return capitalized.charAt(0).toLowerCase() + capitalized.slice(1);
}

export function getVarsFromFormatString(formatString: string): string[] {
	return getMessageFormatter(formatString)
		.getAst()
		.filter((e) => e.type === 1)
		.map((e) => (e as unknown as { value: string }).value);
}
