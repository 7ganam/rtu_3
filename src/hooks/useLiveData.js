import { useEffect, useRef, useState } from "react";

import axios from "axios";

// a function to make a delay inside an async function
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function useLiveData(mode, mqttClient) {
  const firstRequestDelay = 500;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startFetching, setStartFetching] = useState(false);
  const [url, setUrl] = useState("");
  const [isFirstRequest, setIsFirstRequest] = useState(true);
  // ref to store mqtt subscription topics
  const topicsRefs = useRef([]);
  const subTopicsRefs = useRef([]);
  const start = (url) => {
    setData(null);
    setError(null);
    setUrl(url);
    setLoading(true);
    setStartFetching(true);
  };

  const topics = [
    "/static-dynamic/response",
    "/dido/1/response",
    "/dido/2/response",
    "/algorithms/1/response",
    "/algorithms/2/response",
    "/alarms/response",
  ];

  const publishTopics = topics.map((topic) => topic.replace("/response", ""));

  let stopRemoteListening = () => {
    try {
      topics.forEach((subscription) => {
        mqttClient.unsubscribe(subscription);
      });
      // Clear all intervals
      topicsRefs.current.forEach((intervalId) => clearInterval(intervalId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    stopRemoteListening();

    let isMounted = true;
    let intervalIdLocal;
    let intervalIdRemote;

    const fetchDataLocal = async () => {
      try {
        if (isFirstRequest) {
          await delay(firstRequestDelay);
        }

        const staticDynamic = await axios.get(url + "static-dynamic");
        let staticDynamicData = staticDynamic.data;

        const nonNullDynamic = staticDynamicData.d.filter(
          (item) => item !== null
        );

        staticDynamicData.d = nonNullDynamic;

        setData((prevData) => {
          return {
            ...prevData,
            static: staticDynamicData.s,
            dynamic: staticDynamicData.d,
          };
        });

        const didoFlag = staticDynamicData?.f?.d;
        const alarmsAlgorithmsFlag = staticDynamicData?.f?.a;

        if (didoFlag || isFirstRequest) {
          if (isFirstRequest) {
            await delay(firstRequestDelay);
          }
          const dido1 = await axios.get(url + "dido/1");
          if (isFirstRequest) {
            await delay(firstRequestDelay);
          }
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

          setData((prevData) => {
            return {
              ...prevData,
              dido_cards: dido,
            };
          });
        }

        if (alarmsAlgorithmsFlag || isFirstRequest) {
          if (isFirstRequest) {
            await delay(firstRequestDelay);
          }
          const algorithms1 = await axios.get(url + "algorithms/1");
          if (isFirstRequest) {
            await delay(firstRequestDelay);
          }
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

          setData((prevData) => {
            return {
              ...prevData,
              algorithms: algorithms,
            };
          });

          if (isFirstRequest) {
            await delay(firstRequestDelay);
          }
          const alarms = await axios.get(url + "alarms");

          let alarmsData = alarms?.data?.alarms ?? [];
          alarmsData = alarmsData.filter((item) => !!item);

          setData((prevData) => {
            return {
              ...prevData,
              alarms: alarmsData,
            };
          });
        }

        setIsFirstRequest(false);
      } catch (err) {
        setError(err);
        console.log("err :>> ", err);
      }
    };

    const fetchDataRemote = () => {
      //subscribe to topics
      topics.map((topic) => mqttClient.subscribe(topic));

      mqttClient.on("message", (receivedTopic, message) => {
        const payload = message.toString();
        const result = JSON.parse(payload);

        if (receivedTopic === "/static-dynamic/response") {
          const nonNullDynamic = result.dynamic.filter((item) => item !== null);
          updateData("static", result.static);
          updateData("dynamic", nonNullDynamic);
        }

        if (
          receivedTopic === "/dido/1/response" ||
          receivedTopic === "/dido/2/response"
        ) {
          const didoData = result.dido_cards || [];
          const source =
            receivedTopic === "/dido/1/response" ? "dido1" : "dido2";
          updateDidoData(didoData, source);
        }

        if (
          receivedTopic === "/algorithms/1/response" ||
          receivedTopic === "/algorithms/2/response"
        ) {
          const algorithmsData = result.algorithms || [];
          const source =
            receivedTopic === "/algorithms/1/response"
              ? "algorithms1"
              : "algorithms2";
          updateAlgorithmsData(algorithmsData, source);
        }

        if (receivedTopic === "/alarms/response") {
          updateData("alarms", result.alarms || []);
        }
      });

      const updateData = (dataKey, newData) => {
        setData((prevData) => ({
          ...prevData,
          [dataKey]:
            dataKey === "static" ? newData : newData.filter((item) => !!item),
        }));
      };

      const updateDidoData = (newData, source) => {
        setData((prevData) => {
          const prevDidoCards = prevData?.dido_cards || [];
          const updatedDidoCards = prevDidoCards.filter(
            (item) => item.source !== source
          );
          const cleanDidoNewData = newData.filter((item) => !!item);

          const newDataWithSource = cleanDidoNewData.map((item) => ({
            ...item,
            source,
          }));

          const didoCardsAll = [
            ...updatedDidoCards,
            ...newDataWithSource,
          ].filter((item) => !!item);
          //dido1 cards are the cards that has the source dido1
          const dido1Cards = didoCardsAll.filter(
            (item) => item.source === "dido1"
          );
          //dido2 cards are the cards that has the source dido2
          const dido2Cards = didoCardsAll.filter(
            (item) => item.source === "dido2"
          );

          const orderedDidoCards = [...dido1Cards, ...dido2Cards];

          return {
            ...prevData,
            dido_cards: orderedDidoCards.filter((item) => !!item),
          };
        });
      };

      const updateAlgorithmsData = (newData, source) => {
        setData((prevData) => {
          const prevAlgorithms = prevData?.algorithms || [];
          const updatedAlgorithms = prevAlgorithms.filter(
            (item) => item.source !== source
          );

          const cleanNewData = newData.filter((item) => !!item);

          const newDataWithSource = cleanNewData.map((item) => ({
            ...item,
            source,
          }));

          const algorithmsAll = [
            ...updatedAlgorithms,
            ...newDataWithSource,
          ].filter((item) => !!item);

          const algorithms1 = algorithmsAll.filter(
            (item) => item.source === "algorithms1"
          );
          const algorithms2 = algorithmsAll.filter(
            (item) => item.source === "algorithms2"
          );

          const orderedAlgorithms = [...algorithms1, ...algorithms2];

          return {
            ...prevData,
            algorithms: orderedAlgorithms,
          };
        });
      };

      // Publish to topics every 3 seconds
      topicsRefs.current = publishTopics.map((topic) => {
        setInterval(() => {
          // console.log("publishing to topic", topic);
          mqttClient.publish(topic, "1", {});
        }, 3000);
      });
    };

    if (mode === "local") {
      clearInterval(intervalIdRemote);
      clearInterval(intervalIdLocal);
      stopRemoteListening();

      //make first request that will have delays between requests
      // if (startFetching) {
      //   fetchDataLocal();
      // }

      //make a first request after a delay of 500ms
      if (startFetching) {
        setTimeout(() => {
          fetchDataLocal();
        }, firstRequestDelay);
      }

      //after the first request, make requests every 3 seconds
      intervalIdLocal = setInterval(() => {
        if (startFetching && !isFirstRequest) {
          fetchDataLocal();
        }
      }, 3000);
    }

    stopRemoteListening();
    if (mode === "remote") {
      clearInterval(intervalIdRemote);
      clearInterval(intervalIdLocal);
      stopRemoteListening();

      if (startFetching && mqttClient?.connected) {
        fetchDataRemote();
      }
    }

    return () => {
      isMounted = false;
      clearInterval(intervalIdLocal);
      clearInterval(intervalIdRemote);
      stopRemoteListening();
    };
  }, [error, url, startFetching, mode, isFirstRequest]);

  return [data, error, start];
}
