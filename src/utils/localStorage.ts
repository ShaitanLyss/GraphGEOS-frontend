export function getLocalStorageUsagePercent(): number | null {
    if (typeof localStorage === 'undefined') {
        console.error("Local storage is not supported in this environment.");
        return null;
    }

    const localStorageSize = JSON.stringify(localStorage).length;
    const localStorageLimit = 5 * 1024 * 1024; // 5MB, the typical limit for most browsers

    if (localStorageSize === 0) {
        return 0; // If local storage is empty, usage is 0%
    }

    const usagePercent = localStorageSize / localStorageLimit;
    return Math.min(usagePercent, 1); // Cap at 100%
}
