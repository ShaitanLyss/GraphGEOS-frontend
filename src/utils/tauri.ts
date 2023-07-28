export function isTauri() : boolean {
    return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
}