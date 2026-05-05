import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChangePasswordPage = () => {
  return (
    <div className="bg-white rounded-xl p-[1px]">
      <div className="bg-white rounded-xl p-6 sm:p-12 flex flex-col">
        <div className="flex items-center gap-2 mb-1 text-primary">
        </div>
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-on-surface mb-2">
          Change Password
        </h1>
        <p className="text-on-surface-variant font-body leading-relaxed opacity-80">
          For your account security, please create a strong and unique new password.
        </p>
        <form className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Input
              label="Current Password"
              placeholder="Enter your current password"
              type="password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              label="New Password"
              placeholder="Enter your new password"
              type="password"
            />
          </div>

          <Button icon="login" className="editorial-gradient">
            Change Password
          </Button>
          <div className="bg-blue-50 p-5 rounded-md space-y-3">
            <p className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider">
              Security Requirements:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary-container text-[18px]">
                  check_circle
                </span>
                Minimum 8 characters
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-outline-variant text-[18px]">
                  radio_button_unchecked
                </span>
                Combination of uppercase & lowercase letters
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-outline-variant text-[18px]">
                  radio_button_unchecked
                </span>
                At least one number or symbol
              </li>
            </ul>
          </div>
        </form>
        <div className="mt-10 flex justify-end">
          <a
            className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-medium text-sm"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back
          </a>
        </div>
      </div>
    </div>
  );
};
export default ChangePasswordPage;
