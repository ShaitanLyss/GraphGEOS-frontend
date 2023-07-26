#[macro_use]
extern crate dotenv_codegen;

pub mod auth {
    use std::sync::Arc;

    use keyring::{Entry, Error};
    use lazy_static::lazy_static;
    use oauth2::{basic::BasicClient, RedirectUrl, ClientId, AuthUrl, TokenUrl};
    use reqwest::Client;
    use serde::{Deserialize, Serialize};
    use url::Url;

    #[derive(Clone)]
    pub struct AuthState {
        // csrf_token: CsrfToken,
        // pkce: Arc<(PkceCodeChallenge, String)>,
        pub client: Arc<BasicClient>,
        // socket_addr: SocketAddr
    }

    pub fn create_client(redirect_url: RedirectUrl) -> BasicClient {
    let client_id = ClientId::new(dotenv!("PUBLIC_AUTH0_CLIENT_ID", "Missing AUTH0_CLIENT_ID!").to_string());

    let auth_url = AuthUrl::new(dotenv!("OAUTH2_AUTH_URL", "Missing AUTH0_AUTH_URL!").to_string());

    let token_url = TokenUrl::new(dotenv!("OAUTH2_TOKEN_URL", "Missing AUTH0_TOKEN_URL!").to_string());

    BasicClient::new(client_id, None, auth_url.unwrap(), token_url.ok())
        .set_redirect_uri(redirect_url)
    }

    // Define the lazy_static for the Keyring
    // lazy_static! {
    //     static ref ENTRY: Result<Entry, Error> = Entry::new("geos-gui", "refresh_token");
    // }

    pub fn refresh_tokens() {
    //     let entry = match ENTRY.as_ref() {
    //         Ok(entry) => entry,
    //         Err(e) => {
    //             println!("Error: {}", e);
    //             return;
    //         }
    //     };

    //     let refresh_token = match entry.get_password() {
    //         Ok(token) => token,
    //         Err(e) => {
    //             println!("Error: {}", e);
    //             return;
    //         }
    //     };

        eprintln!("Refreshing tokens");
    //     // Your token refresh logic goes here
    }

    #[derive(Deserialize)]
    struct TokenResponse {
        access_token: String,
        id_token: String,
        refresh_token: Option<String>,
    }

    pub async fn load_tokens(callback_url: &str) -> Result<(), Box<dyn std::error::Error>> {
        let url = Url::parse(callback_url)?;
        // get code from url
         let code = url.query_pairs()
        .find(|(key, _)| key == "code")
        .map(|(_, value)| value.to_string())
        .expect("Code not found in URL");
        dbg!(&code);

        let exchange_options = serde_json::json!({
            "grant_type": "authorization_code",
            "client_id": "your_client_id_here",
            "code": code.clone(),
            "redirect_uri": "your_redirect_uri_here",
        });

        let client = Client::new();
        let url = format!("https://auth0Domain/oauth/token");
        let response = client
            .post(&url)
            .header("content-type", "application/json")
            .json(&exchange_options)
            .send()
            .await?;

        let token_response: TokenResponse = response.json().await?;

        let access_token = token_response.access_token;
        let id_token = token_response.id_token;
        let refresh_token = token_response.refresh_token;

        if let Some(refresh_token) = refresh_token {
            // Implement the keytar.setPassword() equivalent for storing the refresh token securely.
        }

        // Decode the JWT token using jwt_decode crate.
        // let decoded_token = decode::<serde_json::Value>(&id_token)?;
        // println!("Decoded ID Token: {:?}", decoded_token);

        Ok(())
    }
}
