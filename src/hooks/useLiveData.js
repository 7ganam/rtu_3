import { useRef, useState } from "react";

import axios from "axios";
import { useEffect } from "react";

// a function to make a delay inside an async function
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const useEffectEvent = (callback) => {
  const ref = useRef(callback);

  ref.current = callback;

  return (...args) => {
    ref.current(...args);
  };
};
export function useLiveData(mode, mqttClient) {
  const firstRequestDelay = 500;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startFetching, setStartFetching] = useState(false);
  const [url, setUrl] = useState("");
  const [isFirstRequest, setIsFirstRequest] = useState(true);
  const [isFirstRequestLocal, setIsFirstRequestLocal] = useState(true);

  // ref to store mqtt subscription topics
  const topicsRefs = useRef([]);
  const remotIntervalIdRef = useRef("");
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

  let stopRemoteListening = () => {
    try {
      topics.forEach((subscription) => {
        mqttClient.unsubscribe(subscription);
        // console.log(`unsubscribed to ${subscription}`);
      });
      clearInterval(remotIntervalIdRef.current);
    } catch (error) {
      console.log(error);
    }
  };

  const usSubscribeFrommTopics = (topicsRefs, mqttClient) => {
    if (!mqttClient || !topicsRefs?.current?.length) return;

    topicsRefs.current.forEach((topicData) => {
      const { topic, handle } = topicData;
      mqttClient.unsubscribe(topic, (err) => {
        if (err) {
          console.error(`Error unsubscribing from ${topic}:`, err);
        } else {
          console.log(`Unsubscribed from ${topic}`);
        }
      });

      // Remove the topic from the topicsRefs ref
      const index = topicsRefs.current.findIndex((t) => t.topic === topic);
      if (index !== -1) {
        topicsRefs.current.splice(index, 1);
      }
    });
  };

  const subscribeToTopics = (topics, mqttClient, topicsRefs) => {
    if (!mqttClient) return;

    topics.forEach((subscription) => {
      const handle = mqttClient.subscribe(subscription, (err) => {
        if (err) {
          console.error(`Error subscribing to ${subscription}:`, err);
        } else {
          console.log(`Subscribed to ${subscription}`);
        }
      });

      // Save the subscription handle to the topicsRefs ref
      topicsRefs.current.push({ topic: subscription, handle });
    });
  };

  const onMqttMessageEvent = useEffectEvent(async (receivedTopic, message) => {
    const payload = message.toString();
    const result = JSON.parse(payload);
    if (receivedTopic === "/static-dynamic/response") {
      let staticDynamicData = result;

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
        mqttClient.publish("/dido/1", "1", {});
        if (isFirstRequest) {
          await delay(firstRequestDelay);
        }
        mqttClient.publish("/dido/2", "1", {});
      }

      if (alarmsAlgorithmsFlag || isFirstRequest) {
        if (isFirstRequest) {
          await delay(firstRequestDelay);
        }
        mqttClient.publish("/algorithms/1", "1", {});

        if (isFirstRequest) {
          await delay(firstRequestDelay);
        }
        mqttClient.publish("/algorithms/2", "1", {});

        if (isFirstRequest) {
          await delay(firstRequestDelay);
        }
        mqttClient.publish("/alarms", "1", {});
      }

      setIsFirstRequest(false);
    }

    if (receivedTopic === "/dido/1/response") {
      let dido1 = result;
      let dido1Data = dido1.dido_cards;

      for (const [key, value] of Object.entries(dido1Data)) {
        if (value === null) {
          delete dido1Data.dido[key];
        }
      }

      dido1Data = dido1Data.filter((item) => !!item);

      //mark dido1 data as dido1
      let markedDido1Data = dido1Data.map((item) => {
        return { ...item, patch: "dido1" };
      });

      setData((prevData) => {
        // get previous dido_cards data without dido1 data
        const prevDidoCards =
          prevData?.dido_cards?.filter((item) => item.patch !== "dido1") ?? [];
        return {
          ...prevData,
          dido_cards: [...markedDido1Data, ...prevDidoCards],
        };
      });
    }

    if (receivedTopic === "/dido/2/response") {
      let dido2 = result;
      let dido2Data = dido2.dido_cards;

      for (const [key, value] of Object.entries(dido2Data)) {
        if (value === null) {
          delete dido2Data.dido[key];
        }
      }

      dido2Data = dido2Data.filter((item) => !!item);

      //mark dido2 data as dido2
      let markedDido2Data = dido2Data.map((item) => {
        return { ...item, patch: "dido2" };
      });

      setData((prevData) => {
        // get previous dido_cards data without dido2 data
        const prevDidoCards =
          prevData?.dido_cards?.filter((item) => item.patch !== "dido2") ?? [];

        return {
          ...prevData,
          dido_cards: [...prevDidoCards, ...markedDido2Data],
        };
      });
    }

    if (receivedTopic === "/algorithms/1/response") {
      let algorithms1 = result;
      let algorithms1Data = [];
      if (algorithms1?.algorithms) {
        algorithms1Data = algorithms1.algorithms;
      }
      algorithms1Data = algorithms1Data.filter((item) => !!item);
      let markedAlgorithm1Data = algorithms1Data.map((item) => {
        return { ...item, patch: "algorithm1" };
      });

      setData((prevData) => {
        // get previous dido_cards data without algorithm1 data
        const prevAlgorithms =
          prevData?.algorithms?.filter((item) => item.patch !== "algorithm1") ??
          [];

        return {
          ...prevData,
          algorithms: [...prevAlgorithms, ...markedAlgorithm1Data],
        };
      });
    }

    if (receivedTopic === "/algorithms/2/response") {
      let algorithms2 = result;
      let algorithms2Data = [];
      if (algorithms2?.algorithms) {
        algorithms2Data = algorithms2.algorithms;
      }
      algorithms2Data = algorithms2Data.filter((item) => !!item);
      let markedAlgorithm2Data = algorithms2Data.map((item) => {
        return { ...item, patch: "algorithm2" };
      });

      setData((prevData) => {
        // get previous dido_cards data without algorithm2 data
        const prevAlgorithms =
          prevData?.algorithms?.filter((item) => item.patch !== "algorithm2") ??
          [];

        return {
          ...prevData,
          algorithms: [...prevAlgorithms, ...markedAlgorithm2Data],
        };
      });
    }

    if (receivedTopic === "/alarms/response") {
      let alarms = result;
      let alarmsData = alarms?.alarms ?? [];
      alarmsData = alarmsData.filter((item) => !!item);
      console.log("alarmsData :>> ", alarmsData);
      setData((prevData) => {
        return {
          ...prevData,
          alarms: alarmsData,
        };
      });
    }
  });

  useEffect(() => {
    const subscribeRemote = () => {
      if (!mqttClient) {
        console.log("no mqtt client");
        return;
      }
      usSubscribeFrommTopics(topicsRefs, mqttClient);

      subscribeToTopics(topics, mqttClient, topicsRefs);

      mqttClient.on("message", (receivedTopic, message) =>
        onMqttMessageEvent(receivedTopic, message)
      );
    };

    usSubscribeFrommTopics(topicsRefs, mqttClient);
    subscribeRemote();

    return () => {
      usSubscribeFrommTopics(topics, mqttClient);
    };
  }, [mqttClient]);

  useEffect(() => {
    let intervalIdRemote;

    if (mode === "remote") {
      clearInterval(remotIntervalIdRef.current);

      //make a first request after a delay of 500ms
      if (startFetching) {
        setTimeout(() => {
          mqttClient.publish("/static-dynamic", "1", {});
          console.log("start=====/static-dynamic");
        }, firstRequestDelay);
      }

      //after the first request, make requests every 3 seconds

      intervalIdRemote = setInterval(() => {
        if (startFetching && !isFirstRequest) {
          mqttClient.publish("/static-dynamic", "1", {});
        }
      }, 3000);
      remotIntervalIdRef.current = intervalIdRemote;
    }

    return () => {
      stopRemoteListening();
    };
  }, [startFetching, mode, isFirstRequest]);

  //local fetching
  useEffect(() => {
    let intervalIdLocal;

    const fetchDataLocal = async () => {
      try {
        if (isFirstRequestLocal) {
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

        if (didoFlag || isFirstRequestLocal) {
          if (isFirstRequestLocal) {
            await delay(firstRequestDelay);
          }
          const dido1 = await axios.get(url + "dido/1");
          if (isFirstRequestLocal) {
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

        if (alarmsAlgorithmsFlag || isFirstRequestLocal) {
          if (isFirstRequestLocal) {
            await delay(firstRequestDelay);
          }
          const algorithms1 = await axios.get(url + "algorithms/1");
          if (isFirstRequestLocal) {
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

          if (isFirstRequestLocal) {
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

        setIsFirstRequestLocal(false);
      } catch (err) {
        setError(err);
        console.log("err :>> ", err);
      }
    };

    if (mode === "local") {
      clearInterval(intervalIdLocal);
      stopRemoteListening();
      //make a first request after a delay of 500ms
      if (startFetching) {
        setTimeout(() => {
          fetchDataLocal();
        }, firstRequestDelay);
      }

      //after the first request, make requests every 3 seconds
      intervalIdLocal = setInterval(() => {
        if (startFetching && !isFirstRequestLocal) {
          fetchDataLocal();
        }
      }, 3000);
    }

    return () => {
      clearInterval(intervalIdLocal);
    };
  }, [error, url, startFetching, mode, isFirstRequestLocal]);

  return [data, error, start];
}
