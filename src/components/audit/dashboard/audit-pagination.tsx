interface AuditPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

export function AuditPagination({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange,
}: AuditPaginationProps) {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

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
    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 items-center justify-between">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-900 dark:text-white">{startResult}</span> to{" "}
        <span className="font-medium text-slate-900 dark:text-white">{endResult}</span> of{" "}
        <span className="font-medium text-slate-900 dark:text-white">{totalResults.toLocaleString()}</span> results
      </p>
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
            isPreviousDisabled
              ? "border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
              : "border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
          }`}
          disabled={isPreviousDisabled}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-1 text-slate-400">
                {page}
              </span>
            )
          )}
        </div>
        
        <button
          className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
            isNextDisabled
              ? "border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
              : "border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
          }`}
          disabled={isNextDisabled}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}