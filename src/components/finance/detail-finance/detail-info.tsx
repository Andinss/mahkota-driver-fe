const DetailInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-6">
          Assigned Driver
        </p>
        <div className="flex items-center gap-4">
          <img
            alt="Marco Santoso"
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-100"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuv6QDtGXDHJSPlcWVVQ-VhiH-PO5VbAWgvigfoARjilG9x2gp92FNboHxL4orj_ENf81-cNu_IaFRuckz4MV1-uel0noBqcQYMGn4_uw9zyyFl9LEIFLc_zkbGpdhBq0jnBLs5hZPDEQ6Uddyzh4GJ0jMAHeYoi0kkTlqX49JNriG-eDV1QWd2dOZZeeUvGnHtxFu-f3wIvWgpWV7XmtXVEBfxhjgjOJpZBgprXDeeNYTfrVXgWj6DjJc_Cj_5fyAv2nUInE7Q6Si"
          />
          <div>
            <h4 className="font-bold text-lg text-gray-900">Marco Santoso</h4>
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              ID: DRV-0882
            </p>
          </div>
        </div>
        <button className="mt-6 text-xs font-bold text-blue-600 flex items-center gap-2 hover:translate-x-1 transition-transform">
          VIEW PROFILE{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-6">
          Vehicle Details
        </p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
            <span
              className="material-symbols-outlined text-3xl text-gray-600"
              data-icon="directions_car"
            >
              directions_car
            </span>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">Toyota Alphard</h4>
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              VIN: B 1234 XYZ
            </p>
          </div>
        </div>
        <button className="mt-6 text-xs font-bold text-blue-600 flex items-center gap-2 hover:translate-x-1 transition-transform">
          SERVICE LOG{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};
export default DetailInfo;
