import { useEffect, useState } from "react";

import axios from "axios";

export function useLiveData() {
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
        const staticDynamic = await axios.get(url + "static-dynamic");
        const dido1 = await axios.get(url + "dido/1");
        const dido2 = await axios.get(url + "dido/2");
        const dido = {
          ...dido1.data,
          ...dido2.data,
        };

        //remove all nulls from dido object
        for (const [key, value] of Object.entries(dido)) {
          if (value === null) {
            delete dido[key];
          }
        }

        const algorithms1 = await axios.get(url + "algorithms/1");
        const algorithms2 = await axios.get(url + "algorithms/2");
        const algorithms = {
          ...algorithms1.data,
          ...algorithms2.data,
        };

        //remove all nulls from algorithms object
        for (const [key, value] of Object.entries(algorithms)) {
          if (value === null) {
            delete algorithms[key];
          }
        }

        const alarms = await axios.get(url + "alarms");

        for (const [key, value] of Object.entries(alarms)) {
          if (value === null) {
            delete alarms[key];
          }
        }

        const result = {
          ...staticDynamic.data,
          ...dido,
          ...algorithms,
          ...alarms.data,
        };
        // const result = await axios.get(url);
        // console.log("result :>> ", result);
        if (isMounted) {
          setData(result);
          // clearInterval(intervalId);
          // setStartFetching(false);
          // setLoading(false);
        }
      } catch (err) {
        setError(err);
        // clearInterval(intervalId);
        // setStartFetching(false);
        // setLoading(false);
      }
    };

    const intervalId = setInterval(() => {
      if (startFetching) {
        fetchData();
      }
    }, 10000); // send requests every 3 seconds until response is received

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [data, error, url, startFetching]);

  return [data, error, start];
}
