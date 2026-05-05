import { useState } from "react";
import { UserTableRow } from "./table-row-user";
import { ExportColumn, ModalExport } from "@/components/ui/export";

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
  onExport?: (options: any) => void;
}

const userColumns: ExportColumn[] = [
  { id: "name", label: "Name", defaultChecked: true },
  { id: "email", label: "Email", defaultChecked: true },
  { id: "phone", label: "Phone Number", defaultChecked: true },
  { id: "role", label: "Role", defaultChecked: true },
  { id: "status", label: "Status", defaultChecked: true },
  { id: "id", label: "User ID", defaultChecked: false },
];

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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const startEntry = (currentPage - 1) * resultsPerPage + 1;
  const endEntry = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-900">User Management</h2>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="text-blue-600 text-sm font-medium hover:underline">
          Export Data
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

      <ModalExport
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          setIsExportModalOpen(false);
          onExport?.(options);
        }}
        totalRows={totalResults}
        title="Export User Data"
        description="Generate user reports."
        columns={userColumns}
      />
    </div>
  );
};
