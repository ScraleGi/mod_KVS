
type TemplateType = 'invoice' | 'certificate';

interface TemplateParams {
  user: string;
  date?: string;
}

export async function getTemplateData(type: TemplateType, params: TemplateParams) {
  if (type === 'invoice') {
    return {
      user: params.user,
      date: params.date ?? new Date().toLocaleDateString(),
      cost: 299.99,
      imageUrl: 'https://i.imgur.com/utRZT2L.png',
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