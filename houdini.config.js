/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
	watchSchema: {
		url: 'http://127.0.0.1:8000/api/v1/graphql',
		headers: {
			Authorization(env) {
				return `Bearer a75ce042-2445-4708-8f1f-e9a1e9d3ca19`
			}
		}
	},
	plugins: {
		'houdini-svelte': {
			static: true,
		}
	},

	scalars: {
		/* in your case, something like */
		UUID: {
			// <- The GraphQL Scalar
			type: 'string' // <-  The TypeScript type
		},
		DateTime: {
			type: 'Date',
			unmarshal(val) {
				return val ? new Date(val) : null;
			},

			marshal(date /** @type {Date} */) {
				return date && date.toISOString();
			}
		},
		PythonTypingInfo: {
			type:"unknown"
		}
	}
};

export default config;
