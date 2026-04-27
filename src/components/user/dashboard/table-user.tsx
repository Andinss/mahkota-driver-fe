import { UserTableRow } from "./table-row-user";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: {
    name: string;
    color?: string;
  };
  status: "active" | "inactive";
  lastLogin: {
    date: string;
    time: string;
  };
}

interface UserTableProps {
  users: User[];
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  resultsPerPage?: number;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onExport?: () => void;
}

export const UserTable = ({
  users,
  currentPage = 1,
  totalPages = 6,
  totalResults = 42,
  resultsPerPage = 4,
  onEdit,
  onDelete,
  onResetPassword,
  onExport,
}: UserTableProps) => {
  const startEntry = (currentPage - 1) * resultsPerPage + 1;
  const endEntry = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-900">User Management</h2>
        <button
          onClick={onExport}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Export as CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4 w-12">
                <input
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  type="checkbox"
                />
              </th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {users.map((user, index) => (
              <UserTableRow
                key={user.id || index}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                onResetPassword={onResetPassword}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
