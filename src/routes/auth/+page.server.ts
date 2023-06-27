import { redirect } from '@sveltejs/kit';

export async function load(params) {
    const { url, locals } = params;
    
    const session = await locals.getSession()
    // Redirect to the home page
    if (session && url.searchParams.get('redirect')) {
    throw redirect(302, url.searchParams.get('redirect'));
    }
}