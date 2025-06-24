export async function getTemplateData(
  type: 'invoice' | 'certificate',
  params: { user: string; date?: string }
) {
  if (type === 'invoice') {
    return {
      user: params.user,
      date: params.date ?? new Date().toLocaleDateString(),
      preis: 299.99,
      imageUrl: '', // Add your image path or URL here
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