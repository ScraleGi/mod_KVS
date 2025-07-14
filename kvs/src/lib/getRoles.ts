import { db } from './db'

/**
 * Holt die Rollen und Berechtigungen für einen User anhand der E-Mail.
 */
export async function getRolesByEmail(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    include: { roles: true }, // Hole auch die Rollen
  });

  if (!user) return [];

  // Extrahiere die Rollen und Berechtigungen
  return user.roles.map(role => ({
    id: role.id,
    role: role.name,
  }));
}