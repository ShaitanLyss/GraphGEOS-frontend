import type { GeosXmlSchema$result } from '$houdini';
import type { Writable } from 'svelte/store';

export type GeosDataContext = {
	xmlSchema: Writable<GeosXmlSchema$result['geos']['xmlSchema'] | undefined>;
};
