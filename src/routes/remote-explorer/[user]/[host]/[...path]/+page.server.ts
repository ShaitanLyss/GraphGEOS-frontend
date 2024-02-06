import { RemoteExplorerStore, load_RemoteExplorer } from '$houdini';
import type { PageServerLoad } from './$houdini';

export const load: PageServerLoad = async (event) => {
	const {
		cookies,
		params: { host, path, user }
	} = event;
	const remoteExplorerData = await new RemoteExplorerStore().fetch({
		event,
		variables: {
			explorerInput: {
				host,
				path: '/' + path,
				password: cookies.get('encrypted_linux_password') || '',
				user
			}
		}
	});

	return {
		remoteExplorerData: {
			data: remoteExplorerData.data,
			errors: remoteExplorerData.errors
		}
	};
};
