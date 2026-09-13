"use client";

interface TaskPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

export function TaskPagination({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange,
}: TaskPaginationProps) {
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
    <div className="p-6 bg-white dark:bg-slate-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        Menampilkan{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {startResult}
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
    </div>
  );
}