import * as React from "react";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";

import AlarmsTab from "./components/AlarmsTab";
import AlgorithmsTab from "./components/AlgorithmsTab";
import Box from "@mui/material/Box";
import CardTab from "./components/CardTab";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
// ** MUI Imports
import OutlinedInput from "@mui/material/OutlinedInput";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import axios from "axios";

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

const ConfigTab = ({ liveData, url }) => {
  const [displaysTabValue, setDisplaysTabValue] = React.useState(0);
  const handleDisplaysTabChange = (event, newValue) => {
    setDisplaysTabValue(newValue);
  };

  const [logicTabValue, setLogicTabValue] = React.useState(0);
  const handleLogicTabChange = (event, newValue) => {
    setLogicTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <Grid container spacing={2}>
        {/* ------------------------------------- */}
        <Grid item xs={12} lg={7}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
              <Tabs
                value={logicTabValue}
                onChange={handleLogicTabChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
              >
                <Tab label={`Algorithms`} {...a11yProps(0)} />
                <Tab label={`Alarms`} {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={logicTabValue} index={0}>
              {liveData && liveData?.dido_cards && liveData?.algorithms && (
                <AlgorithmsTab
                  cards={liveData?.dido_cards}
                  algorithms={liveData?.algorithms}
                  url={url}
                />
              )}
            </TabPanel>
            <TabPanel value={logicTabValue} index={1}>
              {liveData && liveData?.dido_cards && liveData?.alarms && (
                <AlarmsTab
                  cards={liveData?.dido_cards}
                  alarms={liveData?.alarms}
                  url={url}
                />
              )}
            </TabPanel>
          </Box>
        </Grid>
        {/* ------------------------------------ */}
        <Grid item xs={12} lg={5}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
              <Tabs
                value={displaysTabValue}
                onChange={handleDisplaysTabChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
              >
                {liveData &&
                  liveData?.dido_cards &&
                  liveData.dido_cards.map((item, index) => {
                    return (
                      <Tab
                        label={`card ${item.number}`}
                        {...a11yProps(index)}
                      />
                    );
                  })}
              </Tabs>
            </Box>

            {liveData &&
              liveData?.dido_cards &&
              liveData.dido_cards.map((item, index) => {
                return (
                  <TabPanel value={displaysTabValue} index={index}>
                    <CardTab card={item} url={url} />
                  </TabPanel>
                );
              })}
          </Box>
        </Grid>
        {/* ------------------------------------- */}
      </Grid>
    </Box>
  );
};

export default ConfigTab;
