var mqtt = require("mqtt");
let mac = "0000000";
const ADDRESS1 = "11111111";
const ADDRESS2 = "22222222";
const ADDRESS3 = "33333333";
const VAR_NAME1 = "var1";
const VAR_NAME2 = "var2";
const VAR_NAME3 = "var3";
const MULTIPLIER1 = 1;
const MULTIPLIER2 = 2;
const MULTIPLIER3 = 3;

var client = mqtt.connect(
  "ws://ec2-54-93-216-161.eu-central-1.compute.amazonaws.com:8000",
  { clientId: mac + Math.random() }
);

client.on("connect", function () {
  console.log("connected  " + client.connected);
});

//handle incoming messages
client.on("message", function (topic, message, packet) {
  console.log("message is " + message);
  console.log("topic is " + topic);
  //if topic is init then send {x:1} to init_response
  if (topic === `/init`) {
    console.log("message is " + message);
    const myMessage = {
      dynamicValues: [
        { address: ADDRESS1, varName: VAR_NAME1, multiplier: MULTIPLIER1 },
        { address: ADDRESS2, varName: VAR_NAME2, multiplier: MULTIPLIER2 },
        { address: ADDRESS3, varName: VAR_NAME3, multiplier: MULTIPLIER3 },
      ],
      configs: {
        gsm_broker: ["1", "2", "3", "4"],
        gsm_port: "3",
        gsm_network: "etisalat",
        eth_ip: ["1", "2", "3", "4"],
        eth_port: "3",
        eth_mac: "123456789",
        rs_id: "1",
        rs_baud: "9600",
        rs_parity: "even",
      },
    };
    client.publish(`/init/response`, JSON.stringify(myMessage), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/static-dynamic`) {
    // console.log("/static-dynamic " + message);
    const myMessage = {
      s: {
        t: "15:0:49 -- 23/8/26",
        a: "232.50",
        b: "232.50",
        c: "232.50",
        d: "0.00",
        e: "0.00",
        g: "0.00",
        f: "50.03",
        h: "0.00",
      },
      d: [
        { a: "5", n: "Reading", x: 1, v: "5004" },
        { a: "0", n: "Readi", x: 1, v: "2317" },
        { a: "2", n: "Reading", x: 1, v: "2317" },
      ],
      f: {
        d: 0,
        a: 0,
      },
    };
    client.publish(`/static-dynamic/response`, JSON.stringify(myMessage), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/dido/1`) {
    // console.log("/dido/1 " + message);
    const myMessage = {
      dido_cards: [
        {
          number: 1,
          type: "input",
          ports: [
            { number: 1, name: "card1Port1", value: "1" },
            { number: 2, name: "", value: "0" },
            { number: 3, name: "test", value: "0" },
            { number: 4, name: "", value: "0" },
            { number: 5, name: "", value: "0" },
            { number: 6, name: "random", value: "0" },
            { number: 7, name: "", value: "0" },
            { number: 8, name: "", value: "1" },
          ],
        },
        {
          number: 2,
          type: "output",
          ports: [
            { number: 1, name: "card1Port1", value: "" },
            { number: 2, name: "", value: "" },
            { number: 3, name: "test", value: "" },
            { number: 4, name: "", value: "" },
            { number: 5, name: "", value: "" },
            { number: 6, name: "random", value: "" },
            { number: 7, name: "", value: "" },
            { number: 8, name: "", value: "" },
          ],
        },
        {
          number: 3,
          type: "input",
          ports: [
            { number: 1, name: "card1Port1", value: "1" },
            { number: 2, name: "", value: "0" },
            { number: 3, name: "test", value: "0" },
            { number: 4, name: "", value: "0" },
            { number: 5, name: "", value: "0" },
            { number: 6, name: "random", value: "0" },
            { number: 7, name: "", value: "0" },
            { number: 8, name: "", value: "1" },
          ],
        },
      ],
    };
    client.publish(`/dido/1/response`, JSON.stringify(myMessage), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/dido/2`) {
    // console.log("/dido/2 " + message);
    const myMessage = {
      dido_cards: [
        {
          number: 4,
          type: "input",
          ports: [
            { number: 1, name: "card3Port1", value: "0" },
            { number: 2, name: "card3Port2", value: "0" },
            { number: 3, name: "card3Port3", value: "0" },
            { number: 4, name: "card3Port4", value: "0" },
            { number: 5, name: "card3Port5", value: "0" },
            { number: 6, name: "card3Port6", value: "0" },
            { number: 7, name: "card3Port7", value: "0" },
            { number: 8, name: "card3Port8", value: "0" },
          ],
        },
        {
          number: 5,
          type: "output",
          ports: [
            { number: 1, name: "card4Port1", value: "0" },
            { number: 2, name: "card4Port2", value: "0" },
            { number: 3, name: "card4Port3", value: "0" },
            { number: 4, name: "card4Port4", value: "0" },
            { number: 5, name: "card4Port5", value: "0" },
            { number: 6, name: "card4Port6", value: "0" },
            { number: 7, name: "card4Port7", value: "0" },
            { number: 8, name: "card4Port8", value: "0" },
          ],
        },
        {
          number: 6,
          type: "output",
          ports: [
            { number: 1, name: "card5Port1", value: "0" },
            { number: 2, name: "card5Port2", value: "0" },
            { number: 3, name: "card5Port3", value: "0" },
            { number: 4, name: "card5Port4", value: "0" },
            { number: 5, name: "card5Port5", value: "0" },
            { number: 6, name: "card5Port6", value: "0" },
            { number: 7, name: "card5Port7", value: "0" },
            { number: 8, name: "card5Port8", value: "0" },
          ],
        },
      ],
    };
    client.publish(`/dido/2/response`, JSON.stringify(myMessage), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/algorithms/1`) {
    // console.log("/algorithms/1 " + message);
    const myMessage = {
      algorithms: [
        null,
        {
          number: 1,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: 250,
          port: "Port 1 CARD 6",
          action: "pulsed",
          value: 0,
        },
      ],
    };
    client.publish(`/algorithms/1/response`, JSON.stringify(myMessage), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/algorithms/2`) {
    // console.log("/algorithms/2" + message);
    const myMessage = {
      algorithms: [
        {
          number: 11,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 12,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 13,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 14,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 15,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 16,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 17,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 18,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 19,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
        {
          number: 20,
          logic_variable: "RMS Voltage 1",
          logic_operation: ">",
          threshold: "1",
          port: "c2p3",
          action: "pulsed",
          value: "1",
        },
      ],
    };
    client.publish(`/algorithms/2/response`, JSON.stringify(myMessage), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/alarms`) {
    // console.log("alarms " + message);
    const myMessage = {
      alarms: [
        null,
        {
          number: 1,
          logic_variable: "RMS Voltage 1",
          logic_operation: "<",
          threshold: 250,
          value: "warning",
        },
      ],
    };
    client.publish(`/alarms/response`, JSON.stringify(myMessage), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/delete-address`) {
    client.publish(`/delete-address/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }
  if (topic === `/add-address`) {
    client.publish(`/add-address/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/create-logic-function`) {
    client.publish(`/create-logic-function/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }
  if (topic === `/delete-logic-function`) {
    console.log("/delete-logic-function");
    console.log("message is " + message);

    client.publish(`/delete-logic-function/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/create-alarm-function`) {
    console.log("/create-alarm-function");
    console.log("message is " + message);
    client.publish(`/create-alarm-function/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }
  if (topic === `/delete-alarm-function`) {
    console.log("/delete-alarm-function");
    console.log("message is " + message);

    client.publish(`/delete-alarm-function/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/create-pulse`) {
    console.log(topic);
    console.log("message is " + message);

    client.publish(`/create-pulse/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/change-port-name`) {
    console.log(topic);
    console.log("message is " + message);

    client.publish(`/change-port-name/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }

  if (topic === `/config`) {
    console.log(topic);
    console.log("message is " + message);

    client.publish(`/config/response`, JSON.stringify(1), {}); // if there is no dynamic values you must send '0'
  }
});

//handle errors
client.on("error", function (error) {
  console.log("Can't connect" + error);
  process.exit(1);
});

//subscribe to topic init_request
client.subscribe(`/init`);
client.subscribe(`/static-dynamic`);
client.subscribe(`/dido/1`);
client.subscribe(`/dido/2`);
client.subscribe(`/algorithms/1`);
client.subscribe(`/algorithms/2`);
client.subscribe(`/alarms`);

client.subscribe(`/delete-address`);
client.subscribe(`/add-address`);
client.subscribe(`/create-logic-function`);
client.subscribe(`/delete-logic-function`);
client.subscribe(`/create-alarm-function`);
client.subscribe(`/delete-alarm-function`);
client.subscribe(`/create-pulse`);
client.subscribe(`/change-port-name`);
client.subscribe(`/config`);

console.log("end of script");
