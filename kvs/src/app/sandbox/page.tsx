'use client'

import { updateUser } from '@/app/actions/action'

export default function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Update User</button>
    </form>
  )
}

// "use client"

// import { myAction } from '@/app/actions/action'

// export default function SandboxPage() {
//   return (
//     <form action={myAction}>
//       <div className="flex justify-center items-center min-h-64">
//         <button
//           className="bg-amber-900 text-white text-2xl px-8 py-4 rounded-lg shadow-lg hover:bg-amber-800 transition-all"
//           type="submit"
//         >
//           Run Action
//         </button>
//       </div>
//     </form>
//   )
// }

