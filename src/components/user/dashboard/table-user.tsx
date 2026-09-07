import { useState } from "react";
import { UserTableRow } from "./table-row-user";
import { ExportColumn, ModalExport } from "@/components/ui/export";

interface User {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  role?: string;
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
  { id: "username", label: "Username", defaultChecked: true },
  { id: "email", label: "Email", defaultChecked: true },
  { id: "role", label: "Role", defaultChecked: true },
  { id: "is_active", label: "Status", defaultChecked: true },
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

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">group</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-base">
              User Management
            </h2>
            <p className="text-xs text-slate-400">{users.length} user terdaftar</p>
          </div>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4 w-12">
                <input
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  type="checkbox"
                />
              </th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
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
    </>
  );
};
