"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Palette = "blue" | "gold";

export const PALETTE_STORAGE_KEY = "colorPalette";

interface PaletteContextType {
  palette: Palette;
  pendingPalette: Palette;
  selectPalette: (p: Palette) => void;
  commitPalette: () => void;
}

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

function applyPalette(palette: Palette) {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-palette", palette);
}

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>("blue");
  const [pendingPalette, setPendingPaletteState] = useState<Palette>("blue");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
      if (stored === "blue" || stored === "gold") {
        setPaletteState(stored);
        setPendingPaletteState(stored);
        applyPalette(stored);
      } else {
        applyPalette("blue");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const selectPalette = (p: Palette) => {
    setPendingPaletteState(p);
  };

  const commitPalette = () => {
    setPaletteState(pendingPalette);
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, pendingPalette);
    } catch {
      /* ignore */
    }
    applyPalette(pendingPalette);
  };

  return (
    <PaletteContext.Provider
      value={{ palette, pendingPalette, selectPalette, commitPalette }}
    >
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
  return ctx;
}