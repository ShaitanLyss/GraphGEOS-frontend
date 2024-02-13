import { PublicKeyStore, RemoteExplorerStore, load_RemoteExplorer } from '$houdini';
import type { PageServerLoad } from './$houdini';

export const load: PageServerLoad = async (event) => {
	const {
		cookies,
		params: { host, path, user }
	} = event;
	const publicKeyPromise = new PublicKeyStore().fetch({ event });

	const remoteExplorerDataPromise = new RemoteExplorerStore().fetch({
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

	const res = await Promise.all([remoteExplorerDataPromise, publicKeyPromise]);
	const remoteExplorerData = res[0];
	const publicKey = res[1].data?.security.publicKey;
	if (publicKey === undefined) {
		throw new Error('Public key not found');
	}

	return {
		publicKey,
		remoteExplorerData: {
			data: remoteExplorerData.data,
			errors: remoteExplorerData.errors
		}
	};
};
