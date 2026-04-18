interface RoleBannerProps {
  iconSize?: string;
}


export function RoleBanner({ iconSize = "text-[180px]" }: RoleBannerProps) {
    
  return (
    <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden h-full flex flex-col justify-between">

      {/* Konten teks */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-4">
          Role Security Protocol
        </h3>
        <p className="text-blue-100 text-lg leading-relaxed max-w-md">
          Managing permissions requires dual-factor authentication for
          sensitive role changes. All permission modifications are logged
          in the Activity Audit trail.
        </p>
      </div>

      
      <div className="mt-8 relative z-10">
        <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white px-6 py-2.5 rounded-xl font-medium text-sm">
          Review Security Logs
        </button>
      </div>

      
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 p-8 opacity-20">
        <span className={`material-symbols-outlined ${iconSize}`}>
          shield_lock
        </span>
      </div>

    </div>
  );
}