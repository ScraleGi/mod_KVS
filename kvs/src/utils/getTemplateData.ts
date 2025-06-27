import { PrismaClient } from '@prisma/client';
const prisma = PrismaClient();

export async function getTemplateData(type: string, id: string) {
  switch (type) {
    case 'invoice': {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          recipient: true,
          courseRegistration: {
            include: {
              participant: true,
              course: {
                include: {
                  program: true,
                  mainTrainer: true,
                },
              },
            },
          },
        },
      });
      if (!invoice) return { error: 'Invoice not found' };
      return {
        user: invoice.courseRegistration.participant.name,
        date: invoice.dueDate.toISOString().split('T')[0],
        invoiceId: invoice.id,
        amount: invoice.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
        recipient: invoice.recipient.name,
        program: invoice.courseRegistration.course.program.name,
        mainTrainer: invoice.courseRegistration.course.mainTrainer.name,
        // Add more fields as needed
      };
    }
    case 'certificate': {
      const registration = await prisma.courseRegistration.findUnique({
        where: { id },
        include: {
          participant: true,
          course: {
            include: {
              program: true,
              mainTrainer: true,
            },
          },
        },
      });
      if (!registration) return { error: 'Registration not found' };
      return {
        user: registration.participant.name,
        date: registration.createdAt.toISOString().split('T')[0],
        certificateId: registration.id,
        courseName: registration.course.program.name,
        trainerName: registration.course.mainTrainer.name,
        startDate: registration.course.startDate.toISOString().split('T')[0],
        // Add more fields as needed
      };
    }
    default:
      return { error: 'Unknown template type' };
  }
}
// Note: This function assumes Prisma is set up and connected to your database.