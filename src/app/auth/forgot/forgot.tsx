import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPasswordPage = () => {
  return (
    <div className="bg-white rounded-xl p-[1px]">
      <div className="bg-white rounded-xl p-5 sm:p-12 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary-container mb-6">
            <span className="material-symbols-outlined" data-icon="lock_reset">
              lock_reset
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              Security Portal
            </span>
          </div>
          <h1 className="text-on-surface text-[2rem] font-black leading-tight tracking-tight mb-4">
            Lupa Kata Sandi
          </h1>
          <p className="text-on-surface-variant text-base leading-relaxed max-w-sm">
            Masukkan email Anda untuk menerima instruksi pengaturan ulang kata
            sandi.
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input label="Email" placeholder="Email" />
          </div>

          <Button icon="lock_reset" className="editorial-gradient">
            Kirim Instruksi
          </Button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
