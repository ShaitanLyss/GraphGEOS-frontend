import { PublicKeyStore, RemoteExplorerStore, load_RemoteExplorer } from '$houdini';
import type { PageServerLoad } from './$houdini';

export const load: PageServerLoad = async (event) => {
	const {
		cookies,
		params: { host, path, user }
	} = event;
	const publicKey = (await new PublicKeyStore().fetch({ event })).data?.security.publicKey;
	if (publicKey === undefined) {
		throw new Error('Public key not found');
	}
	const remoteExplorerData = await new RemoteExplorerStore().fetch({
		event,
		variables: {
			explorerInput: {
				host,
				path: '/' + path,
				encryptedPassword: cookies.get('encrypted_linux_password') || '',
				user
			}
		}
	});

	return {
		publicKey,
		remoteExplorerData: {
			data: remoteExplorerData.data,
			errors: remoteExplorerData.errors
		}
	};
};
