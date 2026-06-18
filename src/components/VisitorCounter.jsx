import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "../supabase";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function trackAndCount() {
      const sessionId = sessionStorage.getItem("visit_sid");
      if (!sessionId) {
        const sid = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
        sessionStorage.setItem("visit_sid", sid);
        await supabase.from("site_visits").insert({ session_id: sid });
      }

      const { count: total, error } = await supabase
        .from("site_visits")
        .select("*", { count: "exact", head: true });

      if (!cancelled && !error) {
        setCount(total);
      }
    }

    trackAndCount();
    return () => { cancelled = true; };
  }, []);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-600">
      <Eye className="h-3 w-3 text-zinc-500" />
      {count.toLocaleString()} visitors
    </span>
  );
}
