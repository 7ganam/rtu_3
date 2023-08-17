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

        let newData = {
          ...data,
          static: staticDynamicData.static,
          dynamic: staticDynamicData.dynamic,
        };
        if (isMounted) {
          setData(newData);
        }

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

        // remove untruthy values from array
        dido = dido.filter((item) => !!item);

        newData = {
          ...data,
          dido_cards: dido,
        };
        if (isMounted) {
          setData(newData);
        }

        const algorithms1 = await axios.get(url + "algorithms/1");
        const algorithms2 = await axios.get(url + "algorithms/2");

        let algorithms1Data = [];
        let algorithms2Data = [];

        if (algorithms1?.data?.algorithms) {
          algorithms1Data = algorithms1.data.algorithms;
        }
        if (algorithms2?.data?.algorithms) {
          algorithms2Data = algorithms2.data.algorithms;
        }

        let algorithms = [...algorithms1Data, ...algorithms2Data];

        // remove untruthy values from array
        algorithms = algorithms.filter((item) => !!item);

        newData = {
          ...data,
          algorithms: algorithms,
        };
        if (isMounted) {
          setData(newData);
        }

        const alarms = await axios.get(url + "alarms");

        let alarmsData = alarms?.data?.alarms ?? [];
        alarmsData = alarmsData.filter((item) => !!item);

        newData = {
          ...data,
          alarms: alarmsData,
        };
        if (isMounted) {
          setData(newData);
        }

        // const result = {
        //   static: staticDynamicData.static,
        //   dynamic: staticDynamicData.dynamic,
        //   dido_cards: dido,
        //   algorithms: algorithms,
        //   alarms: alarmsData,
        // };

        // if (isMounted) {
        //   setData(result);
        //   // clearInterval(intervalId);
        //   // setStartFetching(false);
        //   // setLoading(false);
        // }
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
