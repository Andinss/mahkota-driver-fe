"use client";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
}: PaginationProps) {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-3">
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Tampilkan</span>
            <select
              value={resultsPerPage}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>data</span>
          </div>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Menampilkan{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {totalResults > 0 ? startResult : 0}
          </span>{" "}
          -{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {endResult}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {totalResults}
          </span>{" "}
          data
        </p>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              isPreviousDisabled
                ? "text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
            }`}
            disabled={isPreviousDisabled}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Sebelumnya
          </button>

          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${
                  page === currentPage
                    ? "bg-primary text-white cursor-default"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 cursor-pointer"
                }`}
                onClick={() => onPageChange(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-slate-400">
                {page}
              </span>
            ),
          )}

          <button
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              isNextDisabled
                ? "text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
            }`}
            disabled={isNextDisabled}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
