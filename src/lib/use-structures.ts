import { useEffect, useState } from "react";
import { getStructures, type Structure } from "@/lib/recrutement";

/** Structures actives du club, chargées une fois par page. */
export function useStructures() {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getStructures()
      .then((list) => {
        if (!cancelled) setStructures(list);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { structures, loading, error };
}
