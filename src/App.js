import React, { useEffect, useRef, useState } from "react";
// import useInits from "./hooks/useInits";
// import useLiveData from "./hooks/useLiveData";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

// import ChartsTab from "./components/tabs/ChartsTab";
// import PowerTab from "./components/tabs/PowerTab";
import { Button } from "@mui/material";

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

  const [inputIP, setInputIp] = useState("");

  return (
    <Box sx={{ bgcolor: "#EBEBEBCA", height: "100vh" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{ mx: "30px", boxShadow: "-3px 4px 5px #afafaf", mt: "30px" }}
          >
            <CardHeader title="Data and configuration"></CardHeader>
            <CardContent>
              <Typography sx={{ mb: 2 }}>{JSON.stringify("inits")}</Typography>
              <Button
                sx={{ mr: 2, mt: 2 }}
                variant="contained"
                onClick={() => {
                  // requestInits(inputIP);
                }}
              >
                Request Inits
              </Button>
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
                  {/* <PowerTab
                    inits={inits}
                    liveData={liveData}
                    loadingInits={loading}
                  /> */}
                </TabPanel>
                <TabPanel value={value} index={1}>
                  {/* <ChartsTab liveDataArray={liveDataArray} /> */}
                </TabPanel>
                <TabPanel value={value} index={2}>
                  Item Three
                </TabPanel>
                <TabPanel value={value} index={3}>
                  Item Four
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
