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
        let staticDynamicData = staticDynamic.data;

        const nonNullDynamic = staticDynamicData.dynamic.filter(
          (item) => item !== null
        );

        staticDynamicData.dynamic = nonNullDynamic;

        const dido1 = await axios.get(url + "dido/1");
        const dido2 = await axios.get(url + "dido/2");

        const dido1Data = dido1.data.dido_cards;
        const dido2Data = dido2.data.dido_cards;

        for (const [key, value] of Object.entries(dido1Data)) {
          if (value === null) {
            delete dido1Data.dido[key];
          }
        }

        for (const [key, value] of Object.entries(dido2Data)) {
          if (value === null) {
            delete dido2Data[key];
          }
        }
        let dido = [...dido1Data, ...dido2Data];

        dido = dido.filter((item) => item !== undefined);

        // const dido = {
        //   ...dido1.data,
        //   ...dido2.data,
        // };

        console.log("dido :>> ", dido);

        const algorithms1 = await axios.get(url + "algorithms/1");
        const algorithms2 = await axios.get(url + "algorithms/2");

        const algorithms1Data = algorithms1.data.algorithms;
        const algorithms2Data = algorithms2.data.algorithms;

        for (const [key, value] of Object.entries(algorithms1Data)) {
          if (value === null) {
            delete algorithms1Data.algorithms[key];
          }
        }

        for (const [key, value] of Object.entries(algorithms2Data)) {
          if (value === null) {
            delete algorithms2Data[key];
          }
        }

        let algorithms = [...algorithms1Data, ...algorithms2Data];

        // remove undefined from array
        algorithms = algorithms.filter((item) => item !== undefined);

        const alarms = await axios.get(url + "alarms");

        console.log("alarms :>> ", alarms);

        const result = {
          static: staticDynamicData.static,
          dynamic: staticDynamicData.dynamic,
          dido: dido,
          algorithms: algorithms,
          ...alarms.data,
        };

        console.log("result :>> ", result);

        if (isMounted) {
          setData(result);
          // clearInterval(intervalId);
          // setStartFetching(false);
          // setLoading(false);
        }
      } catch (err) {
        setError(err);
        console.log("err :>> ", err);
        // clearInterval(intervalId);
        // setStartFetching(false);
        // setLoading(false);
      }
    };

    const intervalId = setInterval(() => {
      if (startFetching) {
        fetchData();
      }
    }, 3000); // send requests every 3 seconds until response is received

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [data, error, url, startFetching]);

  return [data, error, start];
}
