import { auth0 } from "@/lib/auth0";
import { getRolesByEmail } from "@/lib/getRoles";
import { redirect } from "next/navigation";

export async function getAuthorizing({ privilige }: { privilige?: string[] } = {}) {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      redirect("/api/auth/login");
    }

    const email = session.user.email;
    if (!email) {
      redirect("/403");
    }

    const roles = await getRolesByEmail(email);
    if (roles.length === 0) {
      redirect("/403");
    }

    if (privilige && !roles.some(role => privilige.includes(role.role))) {
      redirect("/403");
    }
  } catch (error: any) {
    if (error.digest !== 'NEXT_REDIRECT') {
      console.error("Error in getAuthorizing:", error);
    }
    throw error; // Redirect weiterwerfen!
  }
  return true;
}