import { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export const Table = ({ headers, children, className = "" }: TableProps) => {
  return (
    <table className={`w-full text-left text-sm ${className}`}>
      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-6 py-4 font-semibold">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
        {children}
      </tbody>
    </table>
  );
};

export const TableRow = ({ children, className = "" }: TableRowProps) => {
  return (
    <tr className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${className}`}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = "", colSpan }: TableCellProps) => {
  return (
    <td className={`px-6 py-4 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
};
