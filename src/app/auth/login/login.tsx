"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="bg-white rounded-xl p-[1px]">
      <div className="bg-white rounded-xl p-5 sm:p-12 flex flex-col">
        <div className="mb-4">
          <h1 className="text-4xl font-black text-on-surface tracking-tighter leading-none mb-4 font-headline">
            Sign In
          </h1>
          <p className="text-gray-700 text-base">
            Silakan masuk untuk mengelola armada kendaraan.
          </p>
        </div>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              label="ID Karyawan / Email"
              placeholder="ID Karyawan / Email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Input
              label="Kata Sandi"
              placeholder="Kata Sandi"
              type="password"
            />
          </div>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <Checkbox
                  label="Ingat Saya"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              </div>
            </label>
            <a
              className="text-sm font-bold text-primary-container hover:text-primary transition-colors"
              href="/auth/forgot"
            >
              Lupa Kata Sandi?
            </a>
          </div>
          <Link href="/dashboard">
            <Button icon="login" className="editorial-gradient w-full">
              Masuk Ke Sistem
            </Button>
          </Link>
        </form>
        <Button className="w-full mt-2 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors duration-200">
          <div className="flex items-center justify-center gap-3 w-full h-full">
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.24c0-.72-.05-1.43-.14-2.13H12v4.38h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.84h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.84c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.17-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.82c.88-2.6 3.31-4.53 6.17-4.53z" />
            </svg>

            <span className="text-sm font-semibold text-on-surface">
              Lanjutkan dengan Google
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};
export default LoginPage;
