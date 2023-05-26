import * as React from "react";
import { useState, useEffect } from "react";
// ** MUI Imports
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import axios from "axios";

const ConfigTab = ({ initConfigs, url }) => {
  const onSubmit = async () => {
    if (!initConfigs) return; // if no initConfigs, do nothing
    try {
      const response = await axios.post(url + "config", formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!initConfigs) return;
    setFormData(initConfigs);
    console.log("initConfigs :>> ", initConfigs);
  }, [initConfigs]);

  const [formData, setFormData] = useState({
    gsm_broker: ["", "", "", ""],
    gsm_port: "",
    gsm_network: "",
    eth_ip: ["", "", "", ""],
    eth_port: "",
    eth_mac: "",
    rs_id: "",
    rs_baud: "",
    rs_parity: "",
  });

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <Grid container spacing={8}>
        {/* ------------------------------------- */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            {/* ------------------- */}

            <Grid item xs={12}>
              <Box
                sx={{
                  w: "100%",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "5px",
                  border: "1px solid #FFB300",
                  bgcolor: "#FFB300",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  mb: 2,
                  boxShadow: "-3px 4px 5px #afafaf",
                }}
              >
                GSM Configuration Parameters
              </Box>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Parameters
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Value
            </Grid>

            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Broker
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                value={formData.gsm_broker[0]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    gsm_broker: [
                      event.target.value,
                      formData.gsm_broker[1],
                      formData.gsm_broker[2],
                      formData.gsm_broker[3],
                    ],
                  });
                }}
              />
              <OutlinedInput
                value={formData.gsm_broker[1]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    gsm_broker: [
                      formData.gsm_broker[0],
                      event.target.value,
                      formData.gsm_broker[2],
                      formData.gsm_broker[3],
                    ],
                  });
                }}
              />
              <OutlinedInput
                value={formData.gsm_broker[2]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    gsm_broker: [
                      formData.gsm_broker[0],
                      formData.gsm_broker[1],
                      event.target.value,
                      formData.gsm_broker[3],
                    ],
                  });
                }}
              />
              <OutlinedInput
                value={formData.gsm_broker[3]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    gsm_broker: [
                      formData.gsm_broker[0],
                      formData.gsm_broker[1],
                      formData.gsm_broker[2],
                      event.target.value,
                    ],
                  });
                }}
              />
            </Grid>

            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Port Number
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                value={formData?.gsm_port}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    gsm_port: event.target.value,
                  })
                }
                sx={{ width: "100%" }}
              />
            </Grid>
            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Network Type
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Network</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData?.gsm_network}
                  label="Network"
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      gsm_network: event.target.value,
                    })
                  }
                >
                  <MenuItem value={"etisalat"}>Etisalat</MenuItem>
                  <MenuItem value={"vodafone"}>Vodafone</MenuItem>
                  <MenuItem value={"we"}>We</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* ------------------- */}

            <Grid item xs={12}>
              <Box
                sx={{
                  w: "100%",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "5px",
                  border: "1px solid #FFB300",
                  bgcolor: "#FFB300",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  mb: 2,
                  boxShadow: "-3px 4px 5px #afafaf",
                }}
              >
                Ethernet Configuration Parameters
              </Box>
            </Grid>
            {/* ------------------- */}

            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Parameters
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Value
            </Grid>
            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              IP Address
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                value={formData?.eth_ip[0]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    eth_ip: [
                      event.target.value,
                      formData.eth_ip[1],
                      formData.eth_ip[2],
                      formData.eth_ip[3],
                    ],
                  });
                }}
              />
              <OutlinedInput
                value={formData?.eth_ip[1]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    eth_ip: [
                      formData.eth_ip[0],
                      event.target.value,
                      formData.eth_ip[2],
                      formData.eth_ip[3],
                    ],
                  });
                }}
              />
              <OutlinedInput
                value={formData?.eth_ip[2]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    eth_ip: [
                      formData.eth_ip[0],
                      formData.eth_ip[1],
                      event.target.value,
                      formData.eth_ip[3],
                    ],
                  });
                }}
              />
              <OutlinedInput
                value={formData?.eth_ip[3]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    eth_ip: [
                      formData.eth_ip[0],
                      formData.eth_ip[1],
                      formData.eth_ip[2],
                      event.target.value,
                    ],
                  });
                }}
              />
            </Grid>
            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Port Number
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                value={formData?.eth_port}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    eth_port: event.target.value,
                  })
                }
                sx={{ width: "100%" }}
              />
            </Grid>
            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              MAC Address
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput value={formData?.eth_mac} sx={{ width: "100%" }} />
            </Grid>
            {/* ------------------- */}
          </Grid>
        </Grid>
        {/* ------------------------------------ */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            {/* ------------------- */}
            <Grid item xs={12}>
              <Box
                sx={{
                  w: "100%",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "5px",
                  border: "1px solid #FFB300",
                  bgcolor: "#FFB300",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  mb: 2,
                  boxShadow: "-3px 4px 5px #afafaf",
                }}
              >
                RS485 Configuration Parameters
              </Box>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Parameters
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Value
            </Grid>
            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              ID Address
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                value={formData?.rs_id}
                sx={{ width: "100%" }}
                onChange={(event) =>
                  setFormData({ ...formData, rs_id: event.target.value })
                }
              />
            </Grid>
            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Baud Rate
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Baud Rate</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData?.rs_baud}
                  label="Baud Rate"
                  onChange={(event) =>
                    setFormData({ ...formData, rs_baud: event.target.value })
                  }
                >
                  <MenuItem value={"9600"}>9600</MenuItem>
                  <MenuItem value={"11400"}>11400</MenuItem>
                  <MenuItem value={"55200"}>55200</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* ------------------- */}
            <Grid
              item
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Parity
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Parity</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData?.rs_parity}
                  label="Parity"
                  onChange={(event) =>
                    setFormData({ ...formData, rs_parity: event.target.value })
                  }
                >
                  <MenuItem value={"even"}>even</MenuItem>
                  <MenuItem value={"odd"}>odd</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* ------------------- */}
          </Grid>
        </Grid>
        {/* ------------------------------------- */}
      </Grid>

      <Box
        sx={{
          w: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "50px",
        }}
      >
        <Button
          sx={{ mr: 2, mt: 2, height: "40px", width: "400px" }}
          variant="contained"
          onClick={onSubmit}
        >
          Configure
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigTab;
