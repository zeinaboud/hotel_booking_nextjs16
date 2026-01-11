import { useEffect, useState } from "react";

/**
 * useDebouncedState
 * state يتأخر تحديثه لتقليل side effects (مثل API calls أو URL updates)
 *
 * @param initialValue القيمة الابتدائية للـ state
 * @param delay مدة التأخير بالمللي ثانية
 * @returns [debouncedValue, setValue]
 */
export function useDebouncedState<T>(initialValue: T, delay: number = 300): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return [debouncedValue, setValue];
}
