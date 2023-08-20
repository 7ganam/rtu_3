let intervalIdRemote;
const mqttPost = (client, topic1, topic2, message, callBack) => {
  //random string for request id
  const randomString = Math.random().toString(36).substring(7);
  const messageObject = {
    request_id: randomString,
    message: message,
  };

  function stopListening(message) {
    client.unsubscribe(topic2);
    clearInterval(intervalIdRemote); // Stop publishing to topic1
    console.log(`Stopped listening to ${topic2}`);
    //json parse message
    const payload = message.toString();
    const result = JSON.parse(payload);
    console.log("result :>> ", result);
    callBack(result);
  }

  // Subscribe to topic2
  client.subscribe(topic2);

  // Listen for messages on topic2
  client.on("message", (receivedTopic, message) => {
    if (receivedTopic === topic2) {
      // console.log(`Received message on ${topic2}: ${message}`);
      console.log(`post message on ${topic2}: success`);
      stopListening(message);
    }
  });

  // Publish to topic1 every 3 seconds
  client.publish(topic1, JSON.stringify(messageObject), {});
  intervalIdRemote = setInterval(() => {
    console.log(`publish message on ${topic1}`);
    client.publish(topic1, JSON.stringify(messageObject), {});
  }, 3000);
};

export default mqttPost;
