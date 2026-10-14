import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of the value that only updates
 * after the given delay (ms) has passed without further changes.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}