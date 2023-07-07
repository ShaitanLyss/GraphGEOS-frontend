/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    "watchSchema": {
        "url": "http://127.0.0.1:8000/api/v1/graphql"
    },
    "plugins": {
        "houdini-svelte": {}
    },

    scalars: {
        /* in your case, something like */
        UUID: {                  // <- The GraphQL Scalar
            type: 'string'  // <-  The TypeScript type
        },
        DateTime: {
            type: 'Date',
            unmarshal(val) {
                return val ? new Date(val) : null
            },
            
            marshal(date /** @type {Date} */) {
                return date && date.toISOString()
            }
        }
    }

}

export default config
