'use server'
import { PrismaClient } from '../../../generated/prisma/client'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function deleteArea(formData: FormData) {
    const id = formData.get('id') as string
    const now = new Date()

    await prisma.program.updateMany({
        where: { areaId: id },
        data: { deletedAt: now }
    })

    await prisma.area.update({
        where: { id },
        data: { deletedAt: now }
    })

    redirect('/area')
}