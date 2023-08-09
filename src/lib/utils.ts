import { getContext, setContext } from 'svelte';

export function sayHey(name: string) {
	console.log(`Hey ${name}!`);
}

export function addContextFunction(key: string, f: (...args: unknown[]) => unknown) {
	const current = getContext(key);
	if (current === undefined) {
		setContext(key, f);
		return;
	}

	if (typeof current !== 'function') {
		throw new Error(`Context value for key ${key} is not a function`);
	}

	setContext(key, (...args: unknown[]) => {
		current(...args);
		f(...args);
	});
}
