"use server"
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateSubsidy(registrationId: string, amount: string, remark: string) {
  await db.courseRegistration.update({
    where: { id: registrationId },
    data: {
      subsidyAmount: amount ? Number(amount) : null,
      subsidyRemark: remark || null,
    },
  })
  revalidatePath(`/courseregistration/${registrationId}`)
}

export async function updateDiscount(registrationId: string, amount: string, remark: string) {
  await db.courseRegistration.update({
    where: { id: registrationId },
    data: {
      discountAmount: amount ? Number(amount) : null,
      discountRemark: remark || null,
    },
  })
  revalidatePath(`/courseregistration/${registrationId}`)
}