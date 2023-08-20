import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import React from "react";
import axios from "axios";
import mqttPost from "../../../utils/mqttPost";
import { useForm } from "react-hook-form";

function AlarmsTab({ alarms, url, cards, mode, mqttClient }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState({});

  const onSubmit = async () => {
    let alarmsNumers = alarms.map((alarm) => alarm.number);
    alarmsNumers = alarmsNumers.length === 0 ? [0] : alarmsNumers;

    const maxAlarmsNumber = Math.max(...alarmsNumers);
    const request = { number: maxAlarmsNumber + 1, ...formData };
    console.log("request :>> ", request);
    if (mode === "local") {
      try {
        const response = await axios.post(url + "create-alarm-function", {
          ...request,
        });
      } catch (error) {
        console.error(error);
      }
    } else if (mode === "remote") {
      mqttPost(
        mqttClient,
        "/create-alarm-function",
        "/create-alarm-function/response",
        request,
        () => {}
      );
    }
  };

  const logicVariables = () => {
    let staticInputs = [
      <MenuItem value={"rmsV1"}>RMS Voltage 1</MenuItem>,
      <MenuItem value={"rmsV2"}>RMS Voltage 2</MenuItem>,
      <MenuItem value={"rmsV3"}>RMS Voltage 3</MenuItem>,
      <MenuItem value={"rmsC1"}>RMS Current 1</MenuItem>,
      <MenuItem value={"rmsC2"}>RMS Current 2</MenuItem>,
      <MenuItem value={"rmsC3"}>RMS Current 3</MenuItem>,
    ];

    let inputCards = cards.filter((card) => card.type === "input");
    //loop over the input cards and create a menu item for each port with the value being c_cardNumber_p_portNumber
    let inputInputs = inputCards.map((card) => {
      return card.ports.map((port) => {
        return (
          <MenuItem value={`c${card.number}p${port.number}`}>
            {`Card${card.number}Port${port.number}`}
          </MenuItem>
        );
      });
    });
    //flatten the array
    inputInputs = [].concat.apply([], inputInputs);

    //merge the two arrays
    let inputs = staticInputs.concat(inputInputs);

    return inputs;
  };

  const actionPorts = () => {
    let outputCards = cards.filter((card) => card.type === "output");
    //loop over the output cards and create a menu item for each port with the value being c_cardNumber_p_portNumber
    let outputOutputs = outputCards.map((card) => {
      return card.ports.map((port) => {
        return (
          <MenuItem value={`c${card.number}p${port.number}`}>
            {`Card${card.number}Port${port.number}`}
          </MenuItem>
        );
      });
    });
    //flatten the array
    outputOutputs = [].concat.apply([], outputOutputs);

    return outputOutputs;
  };

  const [deleteValue, setDeleteValue] = useState();
  const onDelete = async () => {
    if (mode === "local") {
      try {
        const response = await axios.post(url + "delete-alarm-function", {
          deleteValue,
        });
      } catch (error) {
        console.error(error);
      }
    } else if (mode === "remote") {
      mqttPost(
        mqttClient,
        "/delete-alarm-function",
        "/delete-alarm-function/response",
        { deleteValue: deleteValue },
        () => {}
      );
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid grey",
        padding: "0px !important",
        mt: "50px",
        borderRadius: "10px",
        boxShadow: "-3px 4px 5px #afafaf",
      }}
    >
      <Box sx={{ border: "1px solid #afafaf" }}>
        <Grid container sx={{ my: "10px" }}>
          <Grid xs={2} sx={{ textAlign: "center" }}>
            Logic variable
          </Grid>
          <Grid xs={2} sx={{ textAlign: "center" }}>
            Logic Operation
          </Grid>
          <Grid xs={2} sx={{ textAlign: "center" }}>
            Threshold Value
          </Grid>
          <Grid xs={6} sx={{ textAlign: "center" }}>
            Action Type
          </Grid>
          {/* ------------------------------- */}
          <Grid xs={12} sx={{ mt: "15px" }} />
          {/* ------------------------------- */}
          <Grid xs={2}>
            <FormControl sx={{ width: "80%", ml: "10px" }}>
              <InputLabel id="demo-simple-select-label" size="small">
                Logic Variable
              </InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData?.logic_variable}
                label="Logic Variable"
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    logic_variable: event.target.value,
                  })
                }
              >
                {logicVariables()}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={2}>
            <FormControl sx={{ width: "80%", ml: "10px" }}>
              <InputLabel id="demo-simple-select-label" size="small">
                Logic operation
              </InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData?.logic_operation}
                label="Logic operation"
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    logic_operation: event.target.value,
                  })
                }
              >
                <MenuItem value={">"}>greater than</MenuItem>
                <MenuItem value={"<"}>less than</MenuItem>
                <MenuItem value={"="}>equal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={2}>
            <OutlinedInput
              sx={{ width: "80%", ml: "10px" }}
              size="small"
              value={formData.threshold}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  threshold: event.target.value,
                });
              }}
            />
          </Grid>

          <Grid xs={6}>
            <FormControl sx={{ width: "90%", ml: "10px", mr: "10px" }}>
              <InputLabel
                id="demo-simple-select-label"
                size="small"
                sx={{ w: "100%" }}
              >
                Action Type
              </InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData?.action}
                label="action type"
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    action: event.target.value,
                  })
                }
              >
                <MenuItem value={"alarm"}>Alarm</MenuItem>
                <MenuItem value={"warning"}>Warning</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* ------------------------------- */}
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box xs={6}>
              <Button
                onClick={onSubmit}
                sx={{ mt: 2, mx: "15px" }}
                variant="contained"
              >
                Generate Logic Function
              </Button>
            </Box>
            <Box
              sx={{
                flexGrow: "1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  border: ".5px #afafaf solid",
                  marginTop: "0px",
                  height: "25px",
                  marginTop: "10px",
                }}
              ></div>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "end", mr: "20px" }}>
              <Box sx={{ display: "flex", mt: 2 }}>
                <Button onClick={onDelete} variant="contained" color="error">
                  Delete Logic Function
                </Button>
                <OutlinedInput
                  sx={{ ml: "10px" }}
                  size="small"
                  value={deleteValue}
                  onChange={(event) => {
                    setDeleteValue(event.target.value);
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
      <Box sx={{ border: "1px solid #afafaf", p: "10px", pb: "30px" }}>
        <Grid container>
          <Grid
            item
            xs={1}
            sx={{
              textAlign: "right",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            #
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              textAlign: "right",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Logic Variable
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              textAlign: "right",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Logic Operation
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              textAlign: "right",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Threshold Value
          </Grid>
          <Grid
            item
            xs={5}
            sx={{
              textAlign: "right",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Action Value
          </Grid>

          {/* ------------------- */}
          {alarms?.map((alarm, index) => {
            return (
              <>
                <Grid
                  item
                  xs={1}
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {alarm?.number}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {alarm?.logic_variable}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {alarm?.logic_operation}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {alarm?.threshold}
                </Grid>
                <Grid
                  item
                  xs={5}
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {alarm?.value}
                </Grid>
              </>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export default AlarmsTab;
