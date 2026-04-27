import AssignDriver from "@/components/user/detail-user/assign-driver";
import ContactInformation from "@/components/user/detail-user/contact-information";
import ActivityLog from "@/components/user/detail-user/log";
import ProfileCard from "@/components/user/detail-user/profile-card";

const UserDetailPage = () => {
  return (
    <div className="flex-1 p-8 lg:px-8  lg:py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Sidebar: Profile Card */}
        <ProfileCard />
        {/* Right Side: Details & Logs */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8">
          {/* Contact Information */}
          <ContactInformation />
          {/* Assigned Drivers */}
          <AssignDriver />

          {/* Activity Log */}
          <ActivityLog />
        </div>
      </div>
      <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50">
        <div className="glass-blur px-4 py-2.5 rounded-full border border-white/60 shadow-xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10"></span>
          <span className="text-[0.65rem] font-black text-on-surface uppercase tracking-[0.1em]">
            Ledger Secure
          </span>
        </div>
      </div>
    </div>
  );
};
export default UserDetailPage;
