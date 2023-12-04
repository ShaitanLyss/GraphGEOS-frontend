import { env } from '$env/dynamic/public';
import { getCookie, getCookies } from 'typescript-cookie';

export function getBackendAddress(path: string = ""): string {
    
    return (
        typeof window === "undefined" ? 'http://backend:8000' :
        'PUBLIC_BACKEND_ADDRESS' in env ?
            env.PUBLIC_BACKEND_ADDRESS :
            typeof document !== 'undefined' && 'PUBLIC_BACKEND_ADDRESS' in getCookies() ?
                getCookie('PUBLIC_BACKEND_ADDRESS') as string :
                'http://127.0.0.1:8000'

    ) + path;
}