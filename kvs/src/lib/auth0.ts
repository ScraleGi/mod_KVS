import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Create a singleton Auth0 client instance for authentication/session management
export const auth0 = new Auth0Client();