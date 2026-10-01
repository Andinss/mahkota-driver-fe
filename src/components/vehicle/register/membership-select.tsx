"use client";

import type { Membership } from "@/lib/types/membership";

interface MembershipSelectProps {
  memberships: Membership[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  loading?: boolean;
}

export function MembershipSelect({
  memberships,
  selectedIds,
  onChange,
  loading = false,
}: MembershipSelectProps) {
  const sorted = [...memberships].sort((a, b) => a.level - b.level);

  const toggle = (id: string) => {
    const target = memberships.find((m) => m.id === id);
    if (!target) return;

    const isChecked = selectedIds.includes(id);

    if (isChecked) {
      const next = selectedIds.filter((x) => {
        const m = memberships.find((mm) => mm.id === x);
        return m ? m.level < target.level : true;
      });
      onChange(next);
    } else {
      const toAdd = memberships
        .filter((m) => m.level <= target.level)
        .map((m) => m.id);
      onChange(Array.from(new Set([...selectedIds, ...toAdd])));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-violet-500 text-xl">
            workspace_premium
          </span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Kategori Membership <span className="text-red-500">*</span>
          </h3>
          <p className="text-xs text-slate-400">
            Pilih kategori membership kendaraan
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" data-testid="membership-options">
        {loading ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Loading membership...
          </span>
        ) : memberships.length === 0 ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Belum ada membership
          </span>
        ) : (
          sorted.map((m) => {
            const checked = selectedIds.includes(m.id);
            return (
              <label
                key={m.id}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm cursor-pointer transition-colors ${
                  checked
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  name="membership_ids"
                  value={m.id}
                  checked={checked}
                  onChange={() => toggle(m.id)}
                  className="accent-primary"
                />
                <span>{m.name}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Rp {Number(m.fee || 0).toLocaleString("id-ID")}
                </span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}