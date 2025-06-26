export function getTemplateData(type: string, id: string) {
  // Beispiel: je nach type und id verschiedene Daten zurückgeben
  switch (type) {
    case 'invoice':
      return {
        user: 'Max Mustermann',
        date: new Date().toISOString().split('T')[0],
        invoiceId: id,
        amount: '123,45 €',
      };
  case 'certificate':
  return {
    user: 'Anna Musterfrau',
    date: new Date().toISOString().split('T')[0],
    certificateId: id,
    courseName: 'React Basics',    // angepasst an EJS
    trainerName: 'Max trainer',    // Beispielwert hinzufügen
    startDate: '2025-01-15',       // Beispielwert hinzufügen
    imageUrl: 'https://example.com/logo.png', // Beispiel-URL, oder lokalen Pfad
  };
    default:
      return {
        user: 'Unbekannt',
        date: new Date().toISOString().split('T')[0],
      };
  }
}