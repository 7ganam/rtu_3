var mqtt = require("mqtt");
let mac = "0000000";

var client = mqtt.connect(
  "ws://ec2-54-93-216-161.eu-central-1.compute.amazonaws.com:8000",
  { clientId: mac + Math.random() }
);

client.on("connect", function () {
  console.log("connected  " + client.connected);
});

// //send mqtt message of "hello" to /init2 every 5 seconds
// setInterval(function () {
//   client.publish("/init", JSON.stringify(1));
//   console.log("publishing");
// }, 1000);

//handle errors
client.on("error", function (error) {
  console.log("Can't connect" + error);
  process.exit(1);
});

// client.on("message", function (topic, message, packet) {
//   console.log("message is " + message);
//   console.log("topic is " + topic);
//   //if topic is init then send {x:1} to init_response
// });

// client.subscribe(`/init2/response`);

const topic = "/static-dynamic/response";

setInterval(function () {
  client.publish(topic, JSON.stringify(1));
  console.log("publishing to", topic);
}, 1000);

console.log("end of script");
