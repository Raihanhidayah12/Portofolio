import { useEffect } from "react";
import AOS from "aos";
import { getAOSOptions } from "../lib/aos";

/**
 * Inisialisasi AOS sekali untuk seluruh halaman publik.
 * @param {boolean} enabled — false saat welcome screen masih aktif
 */
export function useAOS(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    AOS.init(getAOSOptions());
    const refreshTimer = setTimeout(() => AOS.refresh(), 500);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => AOS.refresh(), 200);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      clearTimeout(refreshTimer);
    };
  }, [enabled]);
}
