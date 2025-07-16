import { auth0 } from "@/lib/auth0";
import { getRolesByEmail } from "@/lib/getRoles";
// import { redirect } from "next/navigation";

export async function getAuthorizing({ privilige }: { privilige?: string[] } = {}) {

  const session = await auth0.getSession();
  if (!session || !session.user) {
    //redirect("/auth/login");
    return [];
  }

  const email = session.user.email;
  if (!email) {
    //redirect("/403");
    return [];
  }

  const roles = await getRolesByEmail(email);
  if (roles.length === 0) {
    //redirect("/403");
    return [];
  }

  if (privilige && !roles.some(role => privilige.includes(role.role))) {
    return [];
  }

  return roles;
}