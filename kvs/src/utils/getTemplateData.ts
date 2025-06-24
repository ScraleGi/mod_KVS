// Beispielhafte Funktion zum Bereitstellen von Daten für Templates
// Später mit Prisma & DB-Anbindung erweitern

export async function getTemplateData(type: 'invoice' | 'certificate', params: { user: string; date?: string }) {
  if (type === 'invoice') {
    return {
      user: params.user,
      date: params.date ?? new Date().toLocaleDateString(),
      kursName: 'Beispielkurs 101',
      preis: 299.99,
    };
  }

  if (type === 'certificate') {
    return {
      user: params.user,
      date: params.date ?? new Date().toLocaleDateString(),
      zertifikatText: 'Hiermit wird bestätigt...',
    };
  }

  throw new Error('Unbekannter Template-Typ');
}