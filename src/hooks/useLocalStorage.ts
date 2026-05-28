import {useCallback, useState, useEffect, type Dispatch, type SetStateAction} from "react";

export const useLocalStorage = <T>(
    key: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>, () => void] => {
    const readValue = (): T => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        const storedValue = window.localStorage.getItem(key);

        if (storedValue === null) {
            return initialValue;
        }

        try {
            return JSON.parse(storedValue) as T;
        } catch {
            return initialValue;
        }
    };

    const [value, setValue] = useState<T>(readValue);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key !== key) return;

            if (event.newValue === null) {
                setValue(initialValue);
            } else {
                try {
                    setValue(JSON.parse(event.newValue) as T);
                } catch {
                    setValue(initialValue);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [key, initialValue]);

    const updateValue: Dispatch<SetStateAction<T>> = useCallback((newValue) => {
        setValue((currentValue) => {
            const nextValue =
                typeof newValue === "function"
                    ? (newValue as (value: T) => T)(currentValue)
                    : newValue;

            window.localStorage.setItem(key, JSON.stringify(nextValue));

            return nextValue;
        });
    }, [key]);

    const removeValue = useCallback(() => {
        window.localStorage.removeItem(key);
        setValue(initialValue);
    }, [key, initialValue]);

    return [value, updateValue, removeValue];
};
