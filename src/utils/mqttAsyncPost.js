// Function to simulate an HTTP POST request using MQTT
export async function mqttAsyncPost(
  mqttClient,
  topicName,
  jsonObject = 1,
  timeout = 3000
) {
  return new Promise((resolve, reject) => {
    // Generate a unique response topic for this request
    const responseTopic = `${topicName}/response`;
    console.log("responseTopic :>> ", responseTopic);
    // Subscribe to the response topic
    mqttClient.subscribe(responseTopic);

    // Handle incoming responses
    mqttClient.on("message", (topic, message) => {
      console.log(`Received message on ${topic}: ${message}`);

      if (topic === responseTopic) {
        // Unsubscribe from the response topic
        mqttClient.unsubscribe(responseTopic);

        // Parse the response JSON
        const response = JSON.parse(message.toString());

        // Resolve the promise with the response
        resolve(response);
      }
    });

    // Publish the JSON object to the specified topic
    mqttClient.publish(topicName, JSON.stringify(jsonObject));

    // Simulate a timeout (e.g., 3 seconds) for the request
    setTimeout(() => {
      // Unsubscribe from the response topic on timeout
      mqttClient.unsubscribe(responseTopic);

      // Reject the promise with a timeout error
      reject(new Error("Request timed out"));
    }, timeout);
  });
}
