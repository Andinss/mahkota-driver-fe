import { Input } from "../ui/input";

const CardBrandUpload = () => {
  return (
    <div>
      <section
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        id="branding"
      >
        <div className="flex items-center gap-3 mb-6">
          <span
            className="material-symbols-outlined text-blue-600"
            data-icon="palette"
          >
            palette
          </span>
          <h3 className="text-lg font-semibold text-gray-900">Site Branding</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 group-hover:border-blue-600 transition-colors">
                <span
                  className="material-symbols-outlined text-3xl"
                  data-icon="upload_file"
                >
                  upload_file
                </span>
                <span className="text-[10px] text-gray-500 mt-1">
                  Change Logo
                </span>
              </div>
              <input className="hidden" type="file" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <Input
                  type="text"
                  className="w-full"
                  placeholder="The apps"
                  label="Brand Name"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="The Logistics Authority"
                  className="w-full"
                  label="Tagline"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                PRIMARY COLOR
              </label>
              <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <span className="text-xs text-gray-700">#2563EB</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                ACCENT COLOR
              </label>
              <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-lg">
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
                <span className="text-xs text-gray-700">#4B5563</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default CardBrandUpload;
