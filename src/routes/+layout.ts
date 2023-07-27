import { browser } from '$app/environment';
import { getCookie} from 'svelte-cookie'

// export const ssr = false;
export const prerender = true;

// export const load = async (event) => {
//     console.log("hey")
//     if (!browser)
//     return {};
    
//     const sessionToken = getCookie("sessionToken")
//     const { SessionAndUserStore } = await import("$houdini");
//     const sessionAndUser = new SessionAndUserStore();
//     let data;
//     try {
//         data = (
//             await sessionAndUser.fetch({ event, variables: { sessionToken: sessionToken } })
//         ).data;
//     } catch (error) {
//         console.log("MoonAuth : getSession : error : ", error.message);
//         return null;
//     }
//     const session = data?.session;
//     const user = data?.session?.user;
//     if (session == null || user == null) {
//         return null;
//     }
//     // event.locals.session = { session: session, user: user };
//     console.log('LayoutLoad : getSessionAndUser : session : ', session);
//     return { session: session, user: user };
// };