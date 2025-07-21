'use client'

import { SanitizedInvoiceRecipient, SanitizedParticipant, SanitizedRegistration } from "@/types/query-models"
import { useState, useEffect } from "react"
import RecipientForm from "./recipientForm/RecipientForm"
import { deleteRecipientFromRegistration, addRecipientToCourseRegistration } from "@/app/actions/createRecipientAction"
import { getInvoiceRecipients } from "@/utils/recipientFind"

// Main component
export default function ShowIAndSelectInvoiceRecipient({ sanitizedRegistration }: { sanitizedRegistration: SanitizedRegistration }) {
    const [selectedRecipient, setSelectedRecipient] = useState<SanitizedInvoiceRecipient | null>(
        sanitizedRegistration.invoiceRecipient ?? null
    );
    const [isSelfPayer, setIsSelfPayer] = useState(selectedRecipient === null);

    useEffect(() => {
        setIsSelfPayer(!selectedRecipient);
    }, [selectedRecipient]);

    const handleDeleteRecipient = async () => {
        if (sanitizedRegistration.id) {
            await deleteRecipientFromRegistration(sanitizedRegistration.id);
        }
        setSelectedRecipient(null);
        setIsSelfPayer(true);
    };

    return (
        <>
            {selectedRecipient ? (
                <ShowRecipient
                    recipient={selectedRecipient}
                    participant={sanitizedRegistration.participant}
                    registrationId={sanitizedRegistration.id}
                    onDelete={handleDeleteRecipient}
                />
            ) : (
                <>
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="selfPayer"
                            className="accent-blue-600 w-4 h-4"
                            checked={isSelfPayer}
                            onChange={() => {
                                setIsSelfPayer(!isSelfPayer);
                                setSelectedRecipient(null);
                            }}
                        />
                        <label htmlFor="selfPayer" className="text-sm text-neutral-700 select-none">
                            Selbstzahler
                        </label>
                    </div>
                    <div>
                        {isSelfPayer ? (
                            <ShowRecipient participant={sanitizedRegistration.participant} />
                        ) : (
                            <SelectOrNewInvoiceRecipient
                                onRecipientSelected={setSelectedRecipient}
                                sanitizedRegistration={sanitizedRegistration}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

// Component for selecting or creating new recipient
function SelectOrNewInvoiceRecipient({
    sanitizedRegistration,
    onRecipientSelected,
}: {
    sanitizedRegistration: SanitizedRegistration,
    onRecipientSelected: (recipient: SanitizedInvoiceRecipient) => void
}) {
    return (
        <>
            <SelectRecipientWithAutocomplete
                onSelect={onRecipientSelected}
                sanitizedRegistration={sanitizedRegistration}
            />
            <RecipientForm courseregistrationId={sanitizedRegistration.id} />
        </>
    );
}

// Recipient autocomplete/select
function SelectRecipientWithAutocomplete({
    onSelect,
    sanitizedRegistration
}: {
    onSelect: (recipient: SanitizedInvoiceRecipient) => void,
    sanitizedRegistration: SanitizedRegistration
}) {
    const [recipients, setRecipients] = useState<SanitizedInvoiceRecipient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getInvoiceRecipients().then(fetchedRecipients => {
            setRecipients(
                fetchedRecipients.map(r => ({
                    ...r,
                    type: r.type as import('@/types/models').RecipientType
                }))
            );
            setLoading(false);
        });
    }, []);

    const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const recipient = recipients.find(r => r.id === selectedId);
        if (recipient) {
            await addRecipientToCourseRegistration(selectedId, sanitizedRegistration.id); // ✅ SAVE TO DB
            onSelect(recipient); // ✅ update local UI
        }
    };

    if (loading) return <div>Loading recipients...</div>;
    if (recipients.length === 0) return <div>No recipients found. Please add a new recipient.</div>;

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Select Invoice Recipient</h2>
            <select className="w-full p-2 border border-gray-300 rounded" onChange={handleSelect} defaultValue="">
                <option value="">Select a recipient</option>
                {recipients.map(recipient => (
                    <option key={recipient.id} value={recipient.id}>
                        {recipient.recipientName} {recipient.recipientSurname} - {recipient.companyName}
                    </option>
                ))}
            </select>
        </div>
    );
}

// Show Recipient or Self-Payer details
function ShowRecipient({
    recipient,
    participant,
    registrationId,
    onDelete,
}: {
    recipient?: SanitizedInvoiceRecipient,
    participant: SanitizedParticipant,
    registrationId?: string,
    onDelete?: () => void
}) {
    if (recipient) {
        return (
            <div>
                <h2>Recipient Details</h2>
                <p>Name: {recipient.recipientName} {recipient.recipientSurname}</p>
                <p>Company: {recipient.companyName}</p>
                <p>Email: {recipient.recipientEmail}</p>
                <p>Address: {recipient.recipientStreet}, {recipient.postalCode} {recipient.recipientCity}, {recipient.recipientCountry}</p>
                {onDelete &&
                    <form
                        method="post"
                        onSubmit={async e => {
                            e.preventDefault();
                            await onDelete();
                        }}
                    >
                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete Recipient
                        </button>
                    </form>
                }
            </div>
        );
    } else {
        return (
            <div>
                <h2>Self Payer Details</h2>
                <p>Name: {participant.name} {participant.surname}</p>
                <p>Email: {participant.email}</p>
                <p>Address: {participant.street}, {participant.postalCode} {participant.city}, {participant.country}</p>
            </div>
        );
    }
}
