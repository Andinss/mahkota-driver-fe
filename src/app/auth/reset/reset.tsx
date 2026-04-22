import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChangePasswordPage = () => {
  return (
    <div className="bg-white rounded-xl p-[1px]">
      <div className="bg-white rounded-xl p-6 sm:p-12 flex flex-col">
        <div className="flex items-center gap-2 mb-1 text-primary">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            security
          </span>
          <span className="text-xs font-bold tracking-widest uppercase">
            PT XYZ Rental
          </span>
        </div>
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-on-surface mb-2">
          Ganti Password
        </h1>
        <p className="text-on-surface-variant font-body leading-relaxed opacity-80">
          Demi keamanan akun Anda, silakan buat kata sandi baru yang kuat dan
          unik.
        </p>
        <form className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Input
              label="Kata Sandi"
              placeholder="Kata Sandi"
              type="password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              label="Kata Sandi Baru"
              placeholder="Kata Sandi Baru"
              type="password"
            />
          </div>

          <Button icon="login" className="editorial-gradient">
            Ganti Password
          </Button>
          <div className="bg-blue-50 p-5 rounded-md space-y-3">
            <p className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-wider">
              Persyaratan Keamanan:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary-container text-[18px]">
                  check_circle
                </span>
                Minimal 8 karakter
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-outline-variant text-[18px]">
                  radio_button_unchecked
                </span>
                Kombinasi huruf besar &amp; kecil
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-outline-variant text-[18px]">
                  radio_button_unchecked
                </span>
                Minimal satu angka atau simbol
              </li>
            </ul>
          </div>
        </form>
        <div className="mt-10 flex justify-end">
          <a
            className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-medium text-sm"
            href="#"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Kembali
          </a>
        </div>
      </div>
    </div>
  );
};
export default ChangePasswordPage;
