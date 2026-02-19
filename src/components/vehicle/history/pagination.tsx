import { Icon } from "@/components/ui/icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
}

export const Pagination = ({ currentPage, totalPages, totalResults, resultsPerPage }: PaginationProps) => {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e7eb] dark:border-[#2a3b4d] bg-[#f9fafb] dark:bg-[#1a2634]">
      <div className="flex flex-1 justify-between sm:hidden">
        <a className="relative inline-flex items-center rounded-md border border-[#dce0e5] dark:border-[#2a3b4d] bg-white dark:bg-[#1a2634] px-4 py-2 text-sm font-medium text-[#111418] dark:text-white hover:bg-[#f0f2f4] dark:hover:bg-[#2a3b4d]" href="#">Previous</a>
        <a className="relative ml-3 inline-flex items-center rounded-md border border-[#dce0e5] dark:border-[#2a3b4d] bg-white dark:bg-[#1a2634] px-4 py-2 text-sm font-medium text-[#111418] dark:text-white hover:bg-[#f0f2f4] dark:hover:bg-[#2a3b4d]" href="#">Next</a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#617589] dark:text-[#93adc8]">
            Showing <span className="font-medium text-[#111418] dark:text-white">{startResult}</span> to <span className="font-medium text-[#111418] dark:text-white">{endResult}</span> of <span className="font-medium text-[#111418] dark:text-white">{totalResults}</span> results
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <a className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#617589] dark:text-[#93adc8] ring-1 ring-inset ring-[#dce0e5] dark:ring-[#2a3b4d] hover:bg-[#f0f2f4] dark:hover:bg-[#2a3b4d] focus:z-20 focus:outline-offset-0" href="#">
              <span className="sr-only">Previous</span>
              <Icon name="chevron_left" size="sm" />
            </a>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                aria-current={page === currentPage ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? "bg-primary text-white z-10"
                    : "text-[#111418] dark:text-white ring-1 ring-inset ring-[#dce0e5] dark:ring-[#2a3b4d] hover:bg-[#f0f2f4] dark:hover:bg-[#2a3b4d]"
                } focus:z-20 focus:outline-offset-0`}
                href="#"
              >
                {page}
              </a>
            ))}
            <a className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#617589] dark:text-[#93adc8] ring-1 ring-inset ring-[#dce0e5] dark:ring-[#2a3b4d] hover:bg-[#f0f2f4] dark:hover:bg-[#2a3b4d] focus:z-20 focus:outline-offset-0" href="#">
              <span className="sr-only">Next</span>
              <Icon name="chevron_right" size="sm" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};
