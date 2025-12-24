
import { Auth0Client } from '@auth0/auth0-spa-js';
import { createClient } from '@supabase/supabase-js';
import { variables } from './env';

const supabaseUrl = variables.supabaseUrl;
const supabasePubKey = variables.supabasePubKey;

if (!supabaseUrl || !supabasePubKey) {
    console.warn('Missing Supabase URL or Anon Key in .env file');
}

const auth0 = new Auth0Client({
  domain: variables.auth0Domain,
  clientId: variables.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
})

export const supabase = createClient(
    supabaseUrl, 
    supabasePubKey,
    
);
