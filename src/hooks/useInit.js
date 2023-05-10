import { useState, useEffect } from "react";
import axios from "axios";

export function useInit() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startFetching, setStartFetching] = useState(false);
  const [url, setUrl] = useState("");

  const start = (url) => {
    setData(null);
    setError(null);
    setUrl(url);
    setLoading(true);
    setStartFetching(true);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await axios.get(url);
        console.log("result :>> ", result);
        if (isMounted) {
          setData(result.data);
          clearInterval(intervalId);
          setStartFetching(false);
          setLoading(false);
        }
      } catch (err) {
        setError(err);
        clearInterval(intervalId);
        setStartFetching(false);
        setLoading(false);
      }
    };

    const intervalId = setInterval(() => {
      if (startFetching && data === null && error === null) {
        fetchData();
      }
    }, 3000); // send requests every 3 seconds until response is received

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [data, error, url, startFetching]);

  return [data, error, start, loading];
}
