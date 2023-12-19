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
			link: string;
			attributes: Map<
				string,
				{
					name: string;
					type: string;
					default: string | undefined;
					description: string;
					required: boolean;
				}
			>;
			childTypes: string[];
		}
	>;
};
