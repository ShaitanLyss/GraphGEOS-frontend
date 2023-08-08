

export function isTauri(): boolean {
	return typeof window !== 'undefined' && Object.prototype.hasOwnProperty.call(window, '__TAURI__');
}
