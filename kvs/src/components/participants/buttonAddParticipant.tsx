import Link from "next/link";
import { UserPlus } from "lucide-react";

/**
 * AddParticipantButton
 * - Renders a styled button that links to the "add new participant" page.
 * - Intended for use in participant lists or toolbars to add new participants.
 */
export const AddParticipantButton = () => {
  return (
    <Link
      href="/participant/new"
      className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center"
      title="Teilnehmer hinzufügen"
      aria-label="Add Participant"
    >
      {/* Plus icon for "add" action */}
      <UserPlus size={20} />
    </Link>
  );
};

export default AddParticipantButton;