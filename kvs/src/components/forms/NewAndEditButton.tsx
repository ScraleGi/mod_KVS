import CancelButton from '@/components/cancle-Button/cnacleButton';

export function NewAndEditButton(
    {
        buttonText,
    }: {
        buttonText: string;
    }
) {
    return (
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