import { Button } from "@/components/ui/button";

const ProfileCard = () => {
  return (
    <div className="col-span-12 lg:col-span-4 xl:col-span-3 bg-white p-6 lg:p-8 rounded-xl border border-gray-200 shadow-sm text-center">
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white mx-auto">
          <img
            className="w-full h-full object-cover"
            alt="professional portrait of a middle-aged male manager in a light blue shirt looking confidently at the camera with a clean office background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD50qp_sq6VgFWXBXIO5x8Oojos0sdqdbW-Dxq4aFedUdSFowoWv089Uj2DYCqzzHNO7pH_QEXcx5Gv9yzjTu8Jo_h2rk3_esTghqlbbxOC6gEYUFaRsmQCCR3UFLuS9eWz9ksxpGwgWpUiK3B-pPP6SrHGeT7o-YL6QfOQfpM9yT6FJdAFIv_1F-OrRzGMbwNI0bGedvxCnlwkfwce9UZveG5zBLWGB1JeJT6LaWhuGkp359LbJbecAnUJEWydmEY4eh3DcjUI0WGh"
          />
        </div>
        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
      </div>
      <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-1">
        Adrian Syahputra
      </h3>
      <p className="text-blue-600 font-bold text-xs lg:text-sm mb-8 uppercase tracking-[0.15em]">
        Supervisor
      </p>
      <div className="space-y-3 mb-8">
        <div className="px-4 py-3 bg-gray-50 rounded-lg">
          <p className="text-[0.65rem] font-bold text-gray-500 uppercase">
            Employee ID
          </p>
          <span className="text-xs lg:text-sm font-bold text-gray-900">
            XYZ-2024-089
          </span>
        </div>
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg">
          <span className="text-[0.65rem] font-bold text-gray-500 uppercase">
            Status
          </span>
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[0.65rem] font-black rounded uppercase">
            Active
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <Button icon="settings">Manage User</Button>
        <Button icon="block">Deactivate</Button>
      </div>
    </div>
  );
};
export default ProfileCard;