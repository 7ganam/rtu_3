import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import { Button } from "@mui/material";
// ** MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import ConfigTab from "./tabs/ConfigTab";
import Grid from "@mui/material/Grid";
import LogicControlTab from "./tabs/LogicControlTab";
// import ChartsTab from "./components/tabs/ChartsTab";
import PowerTab from "./tabs/PowerTab";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useInit } from "./hooks/useInit";
import { useLiveData } from "./hooks/useLiveData";

// import useLiveData from "./hooks/useLiveData";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const HomeView = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [inputIP, setInputIp] = useState("http://localhost:5000/");

  const [inits, error, startInit, loadingInit] = useInit();

  const [liveData, liveDataError, startLiveData] = useLiveData();
  console.log("liveData :>> ", liveData);

  // const liveData = {
  //   static: {
  //     time: 1,
  //     v1RMS: 3,
  //     v2RMS: 4,
  //     v3RMS: 5,
  //     c1RMS: 3,
  //     c2RMS: 6,
  //     c3RMS: 7,
  //     frequency: 33,
  //     cNeutral: 33,
  //     temp1: 21,
  //     temp2: 22,
  //     temp3: 23,
  //   },
  //   dynamic: [
  //     {
  //       address: "1111111",
  //       varName: "var1",
  //       multiplier: "1",
  //       value: 1.5,
  //     },
  //     {
  //       address: "222222",
  //       varName: "var2",
  //       multiplier: "2",
  //       value: 0,
  //     },
  //     {
  //       address: "333333",
  //       varName: "var3",
  //       multiplier: "3",
  //       value: 31,
  //     },
  //     {
  //       address: "333333",
  //       varName: "var3",
  //       multiplier: "3",
  //       value: 31,
  //     },
  //     {
  //       address: "44",
  //       varName: "ss",
  //       multiplier: "4",
  //       value: 31,
  //     },
  //   ],
  //   dido_cards: [
  //     {
  //       number: 1,
  //       type: "input",
  //       ports: [
  //         { number: 1, name: "card1Port1", value: "1" },
  //         { number: 2, name: "", value: "0" },
  //         { number: 3, name: "test", value: "0" },
  //         { number: 4, name: "", value: "0" },
  //         { number: 5, name: "", value: "0" },
  //         { number: 6, name: "random", value: "0" },
  //         { number: 7, name: "", value: "0" },
  //         { number: 8, name: "", value: "1" },
  //       ],
  //     },
  //     {
  //       number: 2,
  //       type: "output",
  //       ports: [
  //         { number: 1, name: "card1Port1", value: "" },
  //         { number: 2, name: "", value: "" },
  //         { number: 3, name: "test", value: "" },
  //         { number: 4, name: "", value: "" },
  //         { number: 5, name: "", value: "" },
  //         { number: 6, name: "random", value: "" },
  //         { number: 7, name: "", value: "" },
  //         { number: 8, name: "", value: "" },
  //       ],
  //     },
  //     {
  //       number: 3,
  //       type: "input",
  //       ports: [
  //         { number: 1, name: "card1Port1", value: "1" },
  //         { number: 2, name: "", value: "0" },
  //         { number: 3, name: "test", value: "0" },
  //         { number: 4, name: "", value: "0" },
  //         { number: 5, name: "", value: "0" },
  //         { number: 6, name: "random", value: "0" },
  //         { number: 7, name: "", value: "0" },
  //         { number: 8, name: "", value: "1" },
  //       ],
  //     },
  //     { number: 4, type: "input", ports: [] },
  //     { number: 5, type: "output", ports: [] },
  //     { number: 6, type: "input", ports: [] },
  //     { number: 7, type: "input", ports: [] },
  //   ],
  //   algorithms: [
  //     {
  //       number: "1",
  //       logic_variable: "RMS Voltage 1",
  //       logic_operation: ">",
  //       threshold: "1",
  //       port: "c2p3",
  //       action: "pulsed",
  //       value: "1",
  //     },
  //     {
  //       number: "2",
  //       logic_variable: "c1p8",
  //       logic_operation: "<",
  //       threshold: "1",
  //       port: "c2p6",
  //       action: "on",
  //       value: "1",
  //     },
  //     {
  //       number: "3",
  //       logic_variable: "c3p2",
  //       logic_operation: "=",
  //       threshold: "150",
  //       port: "c2p1",
  //       action: "on",
  //       value: "1",
  //     },
  //   ],
  //   alarms: [
  //     {
  //       number: "1",
  //       logic_variable: "RMS Voltage 1",
  //       logic_operation: ">",
  //       threshold: "1",
  //       value: "alarm",
  //     },
  //     {
  //       number: "2",
  //       logic_variable: "c1p8",
  //       logic_operation: "<",
  //       threshold: "1",
  //       value: "warning",
  //     },
  //     {
  //       number: "3",
  //       logic_variable: "c3p2",
  //       logic_operation: "=",
  //       threshold: "150",
  //       value: "alarm",
  //     },
  //   ],
  // };

  //if inits has a non null value fetch the live data
  useEffect(() => {
    if (inits !== null) {
      startLiveData(inputIP);
    }
  }, [inits]);

  return (
    <Box sx={{ bgcolor: "#EBEBEBCA", height: "140vh" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{ mx: "30px", boxShadow: "-3px 4px 5px #afafaf", mt: "30px" }}
          >
            <CardHeader title="Data and configuration"></CardHeader>
            <CardContent>
              {loadingInit ? (
                <Typography sx={{ mb: 2 }}>Loading...</Typography>
              ) : (
                <Button
                  sx={{ mr: 2, mt: 2 }}
                  variant="contained"
                  onClick={() => {
                    startInit(inputIP + "init");
                  }}
                >
                  Request Inits
                </Button>
              )}

              <TextField
                size="small"
                id="outlined-basic"
                label="IP"
                variant="outlined"
                sx={{ mr: 2, mt: 2 }}
                value={inputIP}
                onChange={(event) => {
                  setInputIp(event.target.value);
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ mx: "30px", boxShadow: "-3px 4px 5px #afafaf" }}>
            <CardContent>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    <Tab label="Power Analyzer Readings" {...a11yProps(0)} />
                    <Tab label="Charts" {...a11yProps(1)} />
                    <Tab label="Logic Control" {...a11yProps(2)} />
                    <Tab label="Configuration" {...a11yProps(3)} />
                    <Tab label="Device Information" {...a11yProps(3)} />
                    <Tab label="Ethernet Connector" {...a11yProps(3)} />
                    <Tab label="Get Other Readings" {...a11yProps(3)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <PowerTab liveData={liveData} url={inputIP} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  {/* <ChartsTab liveDataArray={liveDataArray} /> */}
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <LogicControlTab liveData={liveData} url={inputIP} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <ConfigTab
                    initConfigs={inits?.configs ?? null}
                    url={inputIP}
                  />
                </TabPanel>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeView;
