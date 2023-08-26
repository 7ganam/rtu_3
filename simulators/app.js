const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;

const ADDRESS1 = "11111111";
const ADDRESS2 = "22222222";
const ADDRESS3 = "33333333";
const VAR_NAME1 = "var1";
const VAR_NAME2 = "var2";
const VAR_NAME3 = "var3";
const MULTIPLIER1 = 1;
const MULTIPLIER2 = 2;
const MULTIPLIER3 = 3;
let myMessage = `3,1,${ADDRESS1},${VAR_NAME1},${MULTIPLIER1},2,${ADDRESS2},${VAR_NAME2},${MULTIPLIER2},3,${ADDRESS3},${VAR_NAME3},${MULTIPLIER3}`;

app.get("/init", (req, res) => {
  res.status(200);
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
  res.send(JSON.stringify(myMessage));
});

app.get("/static-dynamic", (req, res) => {
  res.status(200);
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
      { a: "58", n: "Reading", x: 1, v: "5004" },
      { a: "0", n: "Reading", x: 1, v: "2317" },
      { a: "2", n: "Reading", x: 1, v: "2317" },
    ],
    f: {
      d: 0,
      a: 0,
    },
  };
  res.send(JSON.stringify(myMessage));
});

app.get("/dido/1", (req, res) => {
  res.status(200);
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
  res.send(JSON.stringify(myMessage));
});

app.get("/dido/2", (req, res) => {
  res.status(200);
  const myMessage = {
    dido_cards: [
      null,
      null,
      null,
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
  res.send(JSON.stringify(myMessage));
});

app.get("/algorithms/1", (req, res) => {
  res.status(200);
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
  res.send(JSON.stringify(myMessage));
});

app.get("/algorithms/2", (req, res) => {
  res.status(200);
  const myMessage = {
    algorithms: [
      // null,
      // null,
      // null,
      // null,
      // null,
      // null,
      // null,
      // null,
      // null,
      // null,
      // {
      //   number: 11,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 12,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 13,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 14,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 15,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 16,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 17,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 18,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 19,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
      // {
      //   number: 20,
      //   logic_variable: "RMS Voltage 1",
      //   logic_operation: ">",
      //   threshold: "1",
      //   port: "c2p3",
      //   action: "pulsed",
      //   value: "1",
      // },
    ],
  };
  res.send(JSON.stringify(myMessage));
});

app.get("/alarms", (req, res) => {
  res.status(200);
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
  res.send(JSON.stringify(myMessage));
});

app.post("/add-address", (req, res) => {
  res.status(200);
  const myMessage = {
    message: "Address added successfully",
  };
  res.send(JSON.stringify(myMessage));
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
