"use client";

import { useState, useEffect } from "react";

interface LocationMapCardProps {
  location: {
    address: string;
    mapUrl: string;
    reportedIssue: string;
  };
}

export const LocationMapCard = ({ location }: LocationMapCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e7edf3] dark:border-gray-800 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-[#e7edf3] dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/50">
        <h3 className="font-bold text-[#0d141b] dark:text-white">Incident Location</h3>
      </div>
      <div className="h-48 w-full relative bg-slate-100 dark:bg-gray-800">
        {isMounted && (
          <img 
            className="w-full h-full object-cover opacity-80" 
            src={location.mapUrl} 
            alt="Map view of incident location"
          />
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 drop-shadow-lg">
          <span className="material-symbols-outlined text-[40px]">location_on</span>
        </div>
      </div>
      <div className="p-4 flex gap-3 items-start bg-yellow-50/50 dark:bg-yellow-900/20">
        <span className="material-symbols-outlined text-orange-500 mt-0.5">warning</span>
        <div>
          <p className="text-sm font-semibold text-[#0d141b] dark:text-white">Reported Issue</p>
          <p className="text-sm text-[#4c739a] dark:text-slate-400">{location.reportedIssue}</p>
        </div>
      </div>
    </div>
  );
};