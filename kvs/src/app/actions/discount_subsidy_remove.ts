"use server"
import { db } from '@/lib/db'

export async function removeSubsidy(courseRegistrationId: string) {
  await db.courseRegistration.update({
    where: { id: courseRegistrationId },
    data: {
      subsidyAmount: null,
      subsidyRemark: null,
    },
  })
}

export async function removeDiscount(courseRegistrationId: string) {
  await db.courseRegistration.update({
    where: { id: courseRegistrationId },
    data: {
      discountAmount: null,
      discountRemark: null,
    },
  })
}