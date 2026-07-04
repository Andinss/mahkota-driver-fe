const Advice = () => {
  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-slate-800 rounded-lg mb-4 overflow-hidden">
        <img
          alt="Role Management Illustration"
          className="object-cover h-full w-full"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ59Lb5aMIBmKR7sviJjoCMOT7bWRey9UeawrVvwau0BVDEPlSD5NBSshG3ynX5Yej_yZZeAShsEe7R4ozdbiZjVxWqq-9OA_mWkHAUrjyCxFbGQjhCSGAU1vxIgr_deDoZocLwRiA34RgGW2gXQMdSwTCSDm3PgTh2OVs2Yb0pIlW9i033mNYXt8FIZSRnDRED6Xg2kSq5x7FrJoHCOBHxccAEvuzMza14JMSXDhKEEgkoA-hzCqC9dI1EAIhbS-6tNINDkE7qJhJ"
        />
      </div>
      <h4 className="font-bold text-sm mb-2 text-gray-900 dark:text-white">
        Security Best Practices
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        Always follow the principle of least privilege. Only grant permissions
        that are strictly necessary for the employee's daily tasks.
      </p>
    </div>
  );
};
export default Advice;
