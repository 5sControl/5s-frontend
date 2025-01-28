import { useEffect, useState } from "react";

const useSessionStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (e) {
      console.warn(e);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useSessionStorage;
