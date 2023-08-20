import { useEffect, useState } from "react";

import axios from "axios";

export function useInit(mode, mqttClient) {
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

  // fetching init data in case mode is local
  useEffect(() => {
    let isMounted = true;
    let intervalIdLocal;
    let intervalIdRemote;

    const fetchDataLocal = async () => {
      try {
        const result = await axios.get(url);
        if (isMounted) {
          setData(result.data);
          clearInterval(intervalIdLocal);
          setStartFetching(false);
          setLoading(false);
        }
      } catch (err) {
        setError(err);
        clearInterval(intervalIdLocal);
        setStartFetching(false);
        setLoading(false);
      }
    };

    const fetchDataRemote = (client, topic1, topic2) => {
      function stopListening(message) {
        client.unsubscribe(topic2);
        console.log(`Stopped listening to ${topic2}`);
        //json parse message
        const payload = message.toString();
        const result = JSON.parse(payload);
        console.log("result :>> ", result);
        setData(result);
        clearInterval(intervalIdRemote); // Stop publishing to topic1
        setStartFetching(false);
        setLoading(false);
      }

      // Subscribe to topic2
      client.subscribe(topic2);

      // Listen for messages on topic2
      client.on("message", (receivedTopic, message) => {
        if (receivedTopic === topic2) {
          // console.log(`Received message on ${topic2}: ${message}`);
          stopListening(message);
        }
      });

      // Publish to topic1 every 3 seconds
      client.publish(topic1, "1", {});
      intervalIdRemote = setInterval(() => {
        client.publish(topic1, "1", {});
      }, 3000);
    };

    if (mode === "local") {
      console.log("startFetching :>> ", startFetching);

      clearInterval(intervalIdRemote);
      clearInterval(intervalIdLocal);

      intervalIdLocal = setInterval(() => {
        if (startFetching) {
          fetchDataLocal();
        }
      }, 3000); // send requests every 3 seconds until response is received
    }

    if (mode === "remote") {
      clearInterval(intervalIdLocal);
      clearInterval(intervalIdRemote);
      if (startFetching) {
        fetchDataRemote(mqttClient, "/init", "/init/response");
      }
    }

    return () => {
      isMounted = false;
      clearInterval(intervalIdLocal);
      clearInterval(intervalIdRemote);
    };
  }, [data, error, url, startFetching, mode, mqttClient]);

  return [data, error, start, loading];
}
