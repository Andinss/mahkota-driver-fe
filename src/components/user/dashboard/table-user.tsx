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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
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
              <th className="px-6 py-4">Phone Number</th>
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

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {startEntry} to {endEntry} of {totalResults} users
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ),
          )}
          <button
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
