'use client'

import { SanitizedInvoiceRecipient, SanitizedParticipant, SanitizedRegistration } from "@/types/query-models"
import { useState } from "react"
import RecipientForm from "./recipientForm/RecipientForm"
import { deleteRecipientFromRegistration } from "@/app/actions/createRecipientAction"



export default function ShowIAndSelectnvoiceRecipient(  params: { sanitizedRegistration: SanitizedRegistration }) {
    const { sanitizedRegistration } = params

    const [isSelfPayer, setIsSelfPayer] = useState(true)


    console.log("sanitizedRegistration", sanitizedRegistration)


    return (
        <>
        {
            sanitizedRegistration.invoiceRecipient ? (
                <ShowRecipient recipient={sanitizedRegistration.invoiceRecipient} participant={sanitizedRegistration.participant} registrationId={sanitizedRegistration.id}/>
            ) : (
                <>
                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="selfPayer"
                        className="accent-blue-600 w-4 h-4"
                        checked={isSelfPayer}
                        onChange={() => setIsSelfPayer(!isSelfPayer)}
                    />
                    <label htmlFor="selfPayer" className="text-sm text-neutral-700 select-none">
                        Selbstzahler
                    </label>
                </div>
                <div>{ 
                    isSelfPayer ? (
                        <ShowRecipient participant={sanitizedRegistration.participant} />
                    ) : (
                        <SelectOrNewInvoiceRecipient sanitizedRegistration={sanitizedRegistration}/>
                    )}</div>
                </>
            )
        }
        </>
    )
}



function SelectOrNewInvoiceRecipient(params: { sanitizedRegistration: SanitizedRegistration }) {
    const { sanitizedRegistration } = params

    return (
        <>
        <RecipientForm courseregistrationId={sanitizedRegistration.id} />
        </>
    )
}


function SelectRecipientWithAutocomplete() {
    return (
        <div>

        </div>
    )
}


function ShowRecipient(params: { recipient?: SanitizedInvoiceRecipient, participant: SanitizedParticipant, registrationId?: string }) {
    const { recipient, participant, registrationId } = params

    if (recipient) {
    return (   
        <div>
            <h2>Recipient Details</h2>
            <p>Name: {recipient.recipientName} {recipient.recipientSurname}</p>
            <p>Company: {recipient.companyName}</p>
            <p>Email: {recipient.recipientEmail}</p>
            <p>Address: {recipient.recipientStreet}, {recipient.postalCode} {recipient.recipientCity}, {recipient.recipientCountry}</p>

            <form
                method="post"
                onSubmit={async e => {
                    e.preventDefault();
                    if (registrationId) {
                        await deleteRecipientFromRegistration(registrationId);
                    }
                }}
            >
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete Recipient
                </button>
            </form>
        </div>
    )
    } else {
        return (
            <div>
                <h2>Self Payer Details</h2>
                <p>Name: {participant.name} {participant.surname}</p>
                <p>Email: {participant.email}</p>
                 <p>Address: {participant.street}, {participant.postalCode} {participant.city}, {participant.country}</p>
            </div>
        )
    }

}