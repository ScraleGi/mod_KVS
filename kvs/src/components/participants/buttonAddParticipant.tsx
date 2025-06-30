import Link from "next/link";
import { UserPlus } from "lucide-react";

export const AddParticipantButton = () => {
  return (
    <Link href="/participant/new">
      <button 
        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium text-sm transition-colors shadow-sm cursor-pointer"
      >
        <UserPlus size={16} />
        <span>Add Participant</span>
      </button>
    </Link>
  )
}

export default AddParticipantButton;
