'use server'
import { db } from "@/lib/db"

export async function getInvoiceRecipients() {
  return await db.invoiceRecipient.findMany({
    orderBy: {
      recipientName: "asc",
    },
  });
}
