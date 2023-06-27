import { redirect } from '@sveltejs/kit';

export async function load(params) {
    
    const { locals } = params;
    const url: URL = params.url;

    const session = await locals.getSession()
    let userSetupSuccess = false;

    // Redirect to the home page
    if (session) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/user/?email=' + session.user.email)
            if (response.status === 404) {
                // create user
                
                const response = await fetch('http://127.0.0.1:8000/api/v1/user/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: session.user.email,
                        username: session.user.name,
                    })
                });
                if (response.status === 201) {
                    userSetupSuccess = true;
                }
            } else if (response.status === 200) {
                // user exists
                userSetupSuccess = true;
            }
        } catch (error) {
            console.log(error)
        }
        const urlUserSetupSuccess = url.searchParams.get('userSetupSuccess');
        if (urlUserSetupSuccess && urlUserSetupSuccess !== userSetupSuccess.toString()) {
            url.searchParams.set('userSetupSuccess', userSetupSuccess.toString()); // Add a new parameter or update an existing one
            
            throw redirect(302, url.href);
            // throw redirect(302, '/auth?redirect=' + url.pathname);
        }

        if (userSetupSuccess && url.searchParams.has('redirect')) {
            throw redirect(302, url.searchParams.get('redirect'));
        }
    }

    

}