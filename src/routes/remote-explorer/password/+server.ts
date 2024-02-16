import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { encrypted_linux_password } = await request.json();
	cookies.set('encrypted_linux_password', encrypted_linux_password, {
		httpOnly: true,
		// TODO make secure a config var because it is only fine
		// for our case since we run in a vpn to access pangea
		secure: false,
		maxAge: 60 * 60 * 24 * 64, // 2 months
		path: '/',
		sameSite: 'strict'
	});

	return new Response();
};
