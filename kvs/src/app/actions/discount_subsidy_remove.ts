"use server"
import { db } from '@/lib/db'

/**
 * Removes the subsidy amount and remark from a course registration.
 */
export async function removeSubsidy(courseRegistrationId: string) {
  await db.courseRegistration.update({
    where: { id: courseRegistrationId },
    data: {
      subsidyAmount: null,
      subsidyRemark: null,
    },
  })
}

/**
 * Removes the discount amount and remark from a course registration.
 */
export async function removeDiscount(courseRegistrationId: string) {
  await db.courseRegistration.update({
    where: { id: courseRegistrationId },
    data: {
      discountAmount: null,
      discountRemark: null,
    },
  })
}