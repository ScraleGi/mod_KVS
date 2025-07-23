import { auth0 } from "@/lib/auth0";
import { getRolesByEmail } from "@/lib/getRoles";
// import { redirect } from "next/navigation";

/**
 * getAuthorizing
 * 
 * Checks the current user's session and roles.
 * Optionally restricts access to users with specific privileges.
 * Returns an array of roles or an empty array if not authorized.
 */
export async function getAuthorizing({ privilige }: { privilige?: string[] } = {}) {
  // Get the current session from Auth0
  const session = await auth0.getSession();
  if (!session || !session.user) {
    // Not logged in, could redirect to login
    //redirect("/auth/login");
    return [];
  }

  const email = session.user.email;
  if (!email) {
    // No email found, could redirect to forbidden
    //redirect("/403");
    return [];
  }

  // Fetch roles for the user by email
  const roles = await getRolesByEmail(email);
  if (roles.length === 0) {
    // No roles found, could redirect to forbidden
    //redirect("/403");
    return [];
  }

  // If privilege restriction is set, check if user has at least one required role
  if (privilige && !roles.some(role => privilige.includes(role.role))) {
    return [];
  }

  // Return roles if authorized
  return roles;
}