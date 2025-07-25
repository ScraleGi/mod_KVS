'use client'

import { SanitizedInvoiceRecipient, SanitizedParticipant, SanitizedRegistration } from "@/types/query-models"
import { useState, useEffect } from "react"
import RecipientForm from "../recipientForm/RecipientForm"
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
            <RecipientForm
              courseregistrationId={sanitizedRegistration.id}
              onRecipientCreated={async (newRecipientId) => {
          // Refetch recipients to get the new one
              const allRecipients = await getInvoiceRecipients();
              const created = allRecipients.find(r => r.id === newRecipientId);
            if (created) {
              // Attach new recipient to the registration
              await addRecipientToCourseRegistration(sanitizedRegistration.id, newRecipientId);
              // Set new recipient selected
              onRecipientSelected({
              ...created,
              type: created.type as import('@/types/models').RecipientType
            });
          }
        }}
        
      />
    </>
  );
}

// Recipient autocomplete/select
function SelectRecipientWithAutocomplete({
   onSelect,
  sanitizedRegistration
}: {
  onSelect: (recipient: SanitizedInvoiceRecipient) => void;
  sanitizedRegistration: SanitizedRegistration;
}) {
  const [recipients, setRecipients] = useState<SanitizedInvoiceRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<SanitizedInvoiceRecipient[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getInvoiceRecipients().then(fetchedRecipients => {
      const typed = fetchedRecipients.map(r => ({
        ...r,
        type: r.type as import('@/types/models').RecipientType
      }));
      setRecipients(typed);
      setFiltered(typed);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered(recipients.slice(0, 10));
    } else {
      setFiltered(
        recipients.filter(r =>
          `${r.recipientName} ${r.recipientSurname} ${r.companyName} ${r.recipientStreet} ${r.recipientCity} ${r.postalCode} ${r.recipientCountry}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    }
  }, [query, recipients]);

  const handleSelect = async (recipient: SanitizedInvoiceRecipient) => {
    await addRecipientToCourseRegistration(sanitizedRegistration.id, recipient.id);
    onSelect(recipient);
    setQuery('');
    setShowDropdown(false);
  };

  if (loading) return <div>Loading recipients...</div>;
  if (recipients.length === 0) return <div>No recipients found. Please add a new recipient.</div>;

  const topMatches = filtered.slice(0, 10);

  // === STYLE APPLIED HERE ===
  return (
    <fieldset className="border border-neutral-200 rounded-lg p-5">
      <legend className="text-base font-semibold text-blue-700 px-2">Empfänger auswählen</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs text-neutral-600">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Type to search..."
            value={query}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 500)}
            onChange={e => setQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          {showDropdown && (
            <ul className="border border-gray-200 rounded max-h-60 overflow-y-auto bg-white shadow z-10">
              {topMatches.length > 0 ? (
                topMatches.map(recipient => (
                  <li
                    key={recipient.id}
                    onClick={() => handleSelect(recipient)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div>
                      <div className="font-semibold">
                        {recipient.recipientName} {recipient.recipientSurname} - {recipient.companyName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {recipient.recipientStreet || ''}, {recipient.postalCode || ''} {recipient.recipientCity || ''}, {recipient.recipientCountry || ''}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No matching recipients</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </fieldset>
  );
}


// Show Recipient or Self-Payer details
function ShowRecipient({
    recipient,
    participant,
    onDelete,
}: {
    recipient?: SanitizedInvoiceRecipient,
    participant: SanitizedParticipant,
    onDelete?: () => void
}) {
    if (recipient) {
        return (
<fieldset className="border border-neutral-200 rounded-lg p-5">
  <legend className="text-base font-semibold text-blue-700 px-2">Empfänger Details</legend>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs text-neutral-600">
    {recipient.recipientName?.trim() && (
      <div>
        <span className="font-semibold">Name:</span> {recipient.recipientName} {recipient.recipientSurname}
      </div>
    )}
    {recipient.companyName?.trim() && (
      <div>
        <span className="font-semibold">Firma:</span> {recipient.companyName}
      </div>
    )}
    <div>
      <span className="font-semibold">Email:</span> {recipient.recipientEmail}
    </div>
    <div className="sm:col-span-2">
      <span className="font-semibold">Adresse:</span> {recipient.recipientStreet}, {recipient.postalCode} {recipient.recipientCity}, {recipient.recipientCountry}
    </div>
    {onDelete && (
      <div className="sm:col-span-2 flex">
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
            Empfänger löschen
          </button>
        </form>
      </div>
    )}
  </div>
</fieldset>
        );
    } else {
        return (
  
<fieldset className="border border-neutral-200 rounded-lg p-5">
  <legend className="text-base font-semibold text-blue-700 px-2">Selbstzahler Infos</legend>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs text-neutral-600">
    <div>
      <span className="font-semibold">Name:</span> {participant?.salutation} {participant.name} {participant.surname}
    </div>
    <div>
      <span className="font-semibold">Email:</span> {participant.email}
    </div>
    <div>
      <span className="font-semibold">Address:</span> {participant.street}, {participant.postalCode} {participant.city}, {participant.country}
    </div>
  </div>
</fieldset>

        );
    }
}
