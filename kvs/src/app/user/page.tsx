import { getAuthorizing } from "@/lib/getAuthorizing"
import TableTopButton from "@/components/navigation/TableTopButton"
import { CourseTable } from '@/components/overviewTable/table'
import { db } from "@/lib/db"
import { privilegesColumns } from "@/components/overviewTable/table"

export default async function PrivilegesPage() {
    // Check user authorization
  await getAuthorizing({
    privilige: ['ADMIN'],
  })
    // Fetch Users with Roles
  const usersWithRoles = await db.user.findMany({
    include: {
      roles: true, // Include roles for each user
    },
    });
    // Prepare table data
  const tableData = usersWithRoles.map(user => ({
    id: user.id,
    email: user.email,
    roles: user.roles.map(role => role.name).join(', '), // Join roles into a string
    }));

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
                    {/* Header */}
                    <TableTopButton
                        title="Berechtigungen"
                        button1="/user/new"
                        button2="/"
                        button3="/user/deleted"
                    />
                    {/* Areas Table */}
                    <CourseTable
                        data={tableData}
                        columns={privilegesColumns}
                    />
                </div>
    );
}