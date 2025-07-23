import CancelButton from '@/components/cancelButton/cancelButton';

/**
 * NewAndEditButton
 * 
 * Renders a button row with a cancel button and a customizable submit button.
 * - buttonText: The label for the submit button (e.g., "Speichern", "Erstellen").
 */
export function NewAndEditButton(
    {
        buttonText,
    }: {
        buttonText: string;
    }
) {
    return (
        // Button row: Cancel (left) and Submit (right)
        <div className="pt-2 flex items-center justify-between">
            <CancelButton>Abbrechen</CancelButton>
            <button
                type="submit"
                className="inline-flex cursor-pointer items-center px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {buttonText}
            </button>
        </div>
    );
}