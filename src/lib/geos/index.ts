import type { GeosXmlSchema$result, LoadingType } from '$houdini';
import type { Writable } from 'svelte/store';

export type GeosDataContext = {
	xmlSchema: Writable<GeosXmlSchema$result['geos']['xmlSchema'] | undefined>;
};

export type GeosSchema = {
	simpleTypes: Map<
		string,
		{
			name: string;
			pattern: string;
		}
	>;
	complexTypes: Map<
		string,
		{
			name: string;
			attributes: Map<
				string,
				{
					name: string;
					type: string;
				}
			>;
			childTypes: string[];
		}
	>;
};
