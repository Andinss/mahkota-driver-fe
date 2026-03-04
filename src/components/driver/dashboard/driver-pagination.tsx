interface DriverPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

export function DriverPagination({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange,
}: DriverPaginationProps) {
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

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        Showing{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {startResult}
        </span>{" "}
        to{" "}
        <span className="font-bold text-slate-900 dark:text-white">{endResult}</span>{" "}
        of{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {totalResults}
        </span>{" "}
        results
      </p>
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 text-sm font-semibold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-lg ${
                page === currentPage
                  ? "bg-primary text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-all border border-transparent"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-slate-400">
              {page}
            </span>
          )
        )}
        <button
          className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
