// import {env} from '$env/dynamic/public';
import { getCookie } from 'typescript-cookie';

export async function checkBackendHealth(): Promise<boolean> {
	try {
		const response = await fetch(`${getCookie('PUBLIC_BACKEND_ADDRESS')}/health`, { cache: 'no-store' });
		if (response.ok) return true;
	} catch (_) {
		console.log('MoonAuth : Backend is dead');
	}
	return false;
}
