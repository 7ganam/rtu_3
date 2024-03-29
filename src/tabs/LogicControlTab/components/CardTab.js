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

function CardTab({ card, url, mode, mqttClient }) {
  const [checked, setChecked] = React.useState([]);

  const handleChange = (portNumber) => {
    //if array doesn't include portNumber, add it else remove it
    if (!checked.includes(portNumber)) {
      setChecked([...checked, portNumber]);
    } else {
      setChecked(checked.filter((item) => item !== portNumber));
    }
  };

  //function that generates binary string from array of checked ports
  const generateBinaryString = () => {
    let binaryString = "";
    for (let i = 1; i <= 8; i++) {
      if (checked.includes(i)) {
        binaryString += "1";
      } else {
        binaryString += "0";
      }
    }
    let reversedBinaryString = binaryString.split("").reverse().join("");
    return reversedBinaryString;
  };

  const onPulseSubmit = async () => {
    const data = {
      card_number: card.number,
      ports: checked,
      ports_binary: generateBinaryString(),
      ports_decimal: parseInt(generateBinaryString(), 2),
    };
    console.log(data);
    if (mode === "local") {
      try {
        const response = await axios.post(url + "create-pulse", data);
      } catch (error) {
        console.error(error);
      }
    } else if (mode === "remote") {
      mqttPost(
        mqttClient,
        "/create-pulse",
        "/create-pulse/response",
        data,
        () => {}
      );
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState({
    new_name: "",
    port_no: "",
  });

  const onSubmit = async () => {
    if (mode === "local") {
      try {
        const response = await axios.post(url + "change-port-name", {
          ...formData,
          card_no: card.number,
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    } else if (mode === "remote") {
      mqttPost(
        mqttClient,
        "/change-port-name",
        "/change-port-name/response",
        {
          ...formData,
          card_no: card.number,
        },
        () => {}
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          border: "1px solid grey",
          padding: "0px !important",
          mt: "50px",
          borderRadius: "10px",
          boxShadow: "-3px 4px 5px #afafaf",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            my: "5px",
          }}
        >
          This card is configured as a Digital {card?.type} Card
        </Box>
        <Box
          sx={{
            borderTop: "1px solid #afafaf",
            borderBottom: "1px solid #afafaf",
            px: "10px",
          }}
        >
          <Grid container spacing={4} sx={{ my: "10px" }}>
            <Grid xs={5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontWeight: "bold",
                  p: "5px",
                  fontSize: "16px",
                }}
              >
                Rename DIDO Port
              </Box>
            </Grid>
            <Grid xs={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" size="small">
                  port number
                </InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData?.port_no}
                  label="Network"
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      port_no: event.target.value,
                    })
                  }
                >
                  <MenuItem value={"1"}>1</MenuItem>
                  <MenuItem value={"2"}>2</MenuItem>
                  <MenuItem value={"3"}>3</MenuItem>
                  <MenuItem value={"4"}>4</MenuItem>
                  <MenuItem value={"5"}>5</MenuItem>
                  <MenuItem value={"6"}>6</MenuItem>
                  <MenuItem value={"7"}>7</MenuItem>
                  <MenuItem value={"8"}>8</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={3} sx={{ px: "5px" }}>
              <OutlinedInput
                size="small"
                value={formData.new_name}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    new_name: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid xs={2}>
              <Button onClick={onSubmit} variant="contained">
                Apply
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ p: "10px" }}>
          <Grid container spacing={2} sx={{ mb: "30px" }}>
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
              Port
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Variable Name
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
              Value
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
              Control
            </Grid>
            {/* ------------------- */}
            {card?.ports &&
              card?.ports?.length > 0 &&
              card?.ports?.map((port, index) => {
                return (
                  <>
                    <Grid
                      item
                      xs={2}
                      sx={{
                        textAlign: "right",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: "10px",
                      }}
                    >
                      {`Port ${port.number}`}
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{
                        textAlign: "right",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {port?.name || "---"}
                    </Grid>
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
                      {port?.value || "---"}
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
                      {card.type === "output" && (
                        <>
                          <Checkbox
                            onChange={() => handleChange(port.number)}
                          ></Checkbox>{" "}
                          <span style={{ fontSize: "10px" }}>Pulse Check</span>
                        </>
                      )}
                    </Grid>
                  </>
                );
              })}
            {/* ------------------- */}
            {card.type === "output" && (
              <>
                <Grid item xs={8} sx={{}}></Grid>

                <Grid
                  item
                  xs={4}
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  <Box sx={{}}>
                    <Button
                      onClick={onPulseSubmit}
                      sx={{ mt: 2 }}
                      variant="contained"
                    >
                      Send Pulse
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default CardTab;
