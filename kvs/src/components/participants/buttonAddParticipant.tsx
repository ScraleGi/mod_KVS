import Link from "next/link";
import { UserPlus } from "lucide-react";

export const AddParticipantButton = () => {
  return (
    <Link
      href="/participant/new"
      className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center"
      title="Add Participant"
      aria-label="Add Participant"
    >
      <UserPlus size={20} />
    </Link>
  );
};

export default AddParticipantButton;
