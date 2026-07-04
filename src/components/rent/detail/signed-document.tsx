interface DocumentSignProps {
  documentUrl?: string;
}

const DocumentSign = ({ documentUrl }: DocumentSignProps) => {
  const hasDocument = !!documentUrl;

  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 sm:p-8 shadow-md border border-gray-200 dark:border-gray-700 h-full">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">
        Signed Documents
      </h3>
      <div className="space-y-3">
        <div className="group flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 text-red-600 flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-xl">
                picture_as_pdf
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Rental Agreement.pdf
              </p>
              <p className="text-[9px] text-gray-500 uppercase">
                {hasDocument ? "Document Available" : "Signed Aug 11, 2024"}
              </p>
            </div>
          </div>
          {hasDocument ? (
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="material-symbols-outlined text-lg text-gray-400 group-hover:text-blue-600 transition-colors"
            >
              download
            </a>
          ) : (
            <span className="material-symbols-outlined text-lg text-gray-400 group-hover:text-blue-600 transition-colors">
              download
            </span>
          )}
        </div>
        <div className="group flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-xl">
                description
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Vehicle Checklist.pdf
              </p>
              <p className="text-[9px] text-gray-500 uppercase">
                Completed at Pick-up
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-lg text-gray-400 group-hover:text-blue-600 transition-colors">
            visibility
          </span>
        </div>
        <div className="group flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 text-gray-600 flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-xl">policy</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Insurance Policy.pdf
              </p>
              <p className="text-[9px] text-gray-500 uppercase">
                Active Coverage
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-lg text-gray-400 group-hover:text-blue-600 transition-colors">
            download
          </span>
        </div>
      </div>
    </div>
  );
};
export default DocumentSign;
