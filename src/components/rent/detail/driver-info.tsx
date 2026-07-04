interface DriverInfoProps {
  name?: string;
  accountType?: string;
  licenseStatus?: string;
  contact?: string;
  email?: string;
  avatar?: string;
}

const DriverInfo = ({
  name = "Alexander K. Thompson",
  accountType = "Executive Account",
  licenseStatus = "Verified",
  contact = "+1 (555) 0123-4567",
  email = "a.thompson@corp.com",
  avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBcXg_CETjrg2l5txB8tmexLnqcs2sPb6X8APwbYFIxzpUmHaJmo7eIG0LIZNJ7TZaTso55b6G6Rw25HDtAVPhg0CnUYL6htrcXoBbpiahAO_3_fVhZ4rX0B-bdrfwsxkzKCj2j-KS3USanbgeM4kvb2EakkyLdEUeSTcy2eGQ13bkA9PBid93qV5s6pYA9e-z3Gb9FjsHe21pD-aMhxfHhy50UghovvCuxoFcw7wy1uMpqyymJ8nf5iNMnCbFlVxk_mZYoTKYVNSQk",
}: DriverInfoProps) => {
  const imgSrc = avatar || undefined;
  const isLicenseVerified =
    licenseStatus?.toLowerCase() === "verified";
  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 sm:p-8 shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">
          Driver Information
        </h3>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow-sm">
            <img
              alt={name}
              className="w-full h-full object-cover"
              src={imgSrc}
            />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {name}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500">
              {accountType}
            </p>
          </div>
        </div>
        <div className="space-y-4 mb-auto">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-500">
              License Status
            </span>
            <span className={`text-xs font-bold ${isLicenseVerified ? "text-green-600" : "text-amber-600"}`}>
              {licenseStatus}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-500">Contact</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {contact}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs font-medium text-gray-500">Email</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white break-all">
              {email}
            </span>
          </div>
        </div>
        <div className="mt-8">
          <button className="w-full py-3 bg-gray-100 text-gray-900 dark:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">
              chat_bubble
            </span>
            Contact Driver
          </button>
        </div>
      </div>
    </div>
  );
};
export default DriverInfo;
