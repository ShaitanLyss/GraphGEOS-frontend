import { browser } from '$app/environment';
import { HoudiniClient } from '$houdini';
import { getCookie } from 'typescript-cookie';

export default new HoudiniClient({
	url: 'http://127.0.0.1:8000/api/v1/graphql',
	// uncomment this to configure the network call (for things like authentication)
	// for more information, please visit here: https://www.houdinigraphql.com/guides/authentication

	fetchParams({ session }) {
		console.log('houdiniClient : fetchParams : session', session);
		let sessionToken;
		if (typeof document !== 'undefined') sessionToken = getCookie('sessionToken');
		else sessionToken = session?.token;
		console.log('sessionToken', sessionToken);
		return {
			headers: {
				Authorization: `Bearer ${sessionToken}`
			}
		};
	}
});
