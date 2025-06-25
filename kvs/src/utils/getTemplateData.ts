import { PrismaClient } from '@prisma/client'

export async function getTemplateData(type: string, id: string, prisma: PrismaClient) {
  if (type === 'invoice') {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        courseRegistration: {
          include: {
            participant: true,
            course: {
              include: { trainer: true, program: true },
            },
          },
        },
      },
    })

    if (!invoice) return null

    return {
      user: invoice.courseRegistration.participant.name,
      courseName: invoice.courseRegistration.course.title,
      trainerName: invoice.courseRegistration.course.trainer.name,
      startDate: invoice.courseRegistration.course.startDate.toDateString(),
      date: invoice.date.toDateString(),
      cost: invoice.amount,
      imageUrl: 'https://i.imgur.com/utRZT2L.png',
    }
  }

  if (type === 'certificate') {  // Korrektur hier
    const reg = await prisma.courseRegistration.findUnique({
      where: { id },
      include: {
        participant: true,
        course: {
          include: { trainer: true, program: true },
        },
      },
    })

    if (!reg) return null

    return {
      user: reg.participant.name,
      courseName: reg.course.title,
      trainerName: reg.course.trainer.name,
      startDate: reg.course.startDate.toDateString(),
      date: new Date().toDateString(),
      imageUrl: 'https://i.imgur.com/utRZT2L.png',  // Falls Logo gewünscht
    }
  }

  return null
}