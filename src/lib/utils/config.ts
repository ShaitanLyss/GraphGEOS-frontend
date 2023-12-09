import { env } from '$env/dynamic/public';
import { getCookie, getCookies } from 'typescript-cookie';
import { PUBLIC_ENABLE_AUTH } from '$env/static/public';

export function getBackendAddress(path = ''): string {
	return (
		('PUBLIC_BACKEND_ADDRESS' in env
			? env.PUBLIC_BACKEND_ADDRESS
			: typeof document !== 'undefined' && 'PUBLIC_BACKEND_ADDRESS' in getCookies()
			? (getCookie('PUBLIC_BACKEND_ADDRESS') as string)
			: 'http://127.0.0.1:8000') + path
	);
}

export function isAuthEnabled(): boolean {
	return PUBLIC_ENABLE_AUTH.toLowerCase().includes('true');
}
