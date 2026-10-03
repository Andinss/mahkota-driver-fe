"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AccountDetails from "@/components/user/detail-user/account-details";
import ContactInformation from "@/components/user/detail-user/contact-information";
import ActivityLog from "@/components/user/detail-user/log";
import ProfileCard from "@/components/user/detail-user/profile-card";
import { usersApi } from "@/lib/api/users";
import type { UserItem } from "@/lib/types/user";

const UserDetailPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [user, setUser] = useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      usersApi.getById(userId)
        .then((res) => {
          const item = (res as any)?.data ?? (res as any);
          if (item?.email || item?.username) {
            setUser(item);
          } else {
            throw new Error("Invalid response");
          }
        })
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 lg:px-8 lg:py-8">
      <div className="w-full grid grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Sidebar: Profile Card */}
        <ProfileCard user={user} />
        {/* Right Side: Details & Logs */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8">
          {/* Contact Information */}
          <ContactInformation user={user} />
          {/* Account Details */}
          <AccountDetails user={user} />
          {/* Activity Log */}
          <ActivityLog user={user} />
        </div>
      </div>
      <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50">
        <div className="glass-blur px-4 py-2.5 rounded-full border border-white/60 dark:border-white/10 shadow-xl flex items-center gap-3 dark:bg-slate-800/80">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10"></span>
          <span className="text-[0.65rem] font-black text-on-surface dark:text-white uppercase tracking-[0.1em]">
            Ledger Secure
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
