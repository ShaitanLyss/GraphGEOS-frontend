import { SvelteKitAuth } from "sk-auth";

export const appAuth = new SvelteKitAuth({
    providers: [
        new GoogleOAuthProvider({
            clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_SECRET,
            profile(profile) {
                return { ...profile, provider: "google" };
            },
        }),
    ],
    jwtSecret: import.meta.env.JWT_SECRET_KEY,
});

// augmenting it
export const getSession: GetSession = async (request) => {
    const { user } = await appAuth.getSession(request);

    return { user };
};