import { useRef, useEffect, useState } from 'react'

const useComponentDidMount = (method: () => void) => {
  const hasMounted = useRef(false)
  useEffect(() => {
    if (!hasMounted.current) {
      method()
    }
    hasMounted.current = true
  }, [method])
}

export {useComponentDidMount}

const useLocalStorage = (key: any, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export {useLocalStorage}