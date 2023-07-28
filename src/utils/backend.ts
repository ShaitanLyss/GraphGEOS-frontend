export async function checkBackendHealth() : Promise<boolean> {
    try {
        const response = await fetch('http://127.0.0.1:8000/health');
        if (response.ok)
            return true;
    } catch (_) {
        console.log("MoonAuth : Backend is dead");
    }
    return false;
}