import type { Invoice } from '@prisma/client'  // Prisma-Types nutzen

type TemplateType = 'invoice' | 'certificate'

export function getTemplateData(type: TemplateType, invoice: Invoice & any) {
  if (type === 'invoice') {
    // invoice ist komplett mit Relationen geladen
    return {
      user: invoice.courseRegistration.participant.name,
      date: invoice.createdAt?.toLocaleDateString() ?? new Date().toLocaleDateString(),
      cost: invoice.amount,
      courseName: invoice.courseRegistration.course.program.name,
      trainerName: invoice.courseRegistration.course.trainer?.name ?? 'Unbekannt',
      startDate: invoice.courseRegistration.course.startDate.toLocaleDateString(),
      imageUrl: 'https://i.imgur.com/utRZT2L.png', // Öffentlich erreichbares Bild
    }
  }

  if (type === 'certificate') {
    return {
      user: invoice.courseRegistration.participant.name,
      date: invoice.createdAt?.toLocaleDateString() ?? new Date().toLocaleDateString(),
      zertifikatText: 'Hiermit wird bestätigt...',
    }
  }

  throw new Error('Unknown template type')
}