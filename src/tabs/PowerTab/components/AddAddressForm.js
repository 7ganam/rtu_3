import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
// ** MUI Imports
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import axios from "axios";
import mqttPost from "../../../utils/mqttPost";
import { useForm } from "react-hook-form";

function AddAddressForm({
  index,
  fromLoading,
  setFormLoading,
  url,
  dynamicData,
  setAllowFormInput,
  mode,
  mqttClient,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    let oldData = dynamicData.map((item, ind) => ({
      index: ind,
      address: item.address,
      varName: item.varName,
      multiple: item.multiplier,
    }));
    let newData = [
      ...oldData,
      {
        index: oldData.length,
        address: data.address,
        varName: data.name,
        multiple: data.multiplier,
      },
    ];
    const request = { count: newData.length, data: newData };
    console.log("request :>> ", request);
    setFormLoading(true);
    if (mode === "local") {
      try {
        const response = await axios.post(url + "add-address", request);
        console.log(response.data);
        setFormLoading(false);
        setAllowFormInput(false);
      } catch (error) {
        setFormLoading(false);
        console.error(error);
      }
    } else if (mode === "remote") {
      mqttPost(
        mqttClient,
        "/add-address",
        "/add-address/response",
        request,
        () => {
          setFormLoading(false);
        }
      );
    }
  };

  return (
    <>
      {!fromLoading ? (
        <>
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
            {index}
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
            <OutlinedInput
              //   value={DynamicEntry.value}
              {...register("address", { required: true })}
            />
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
            <OutlinedInput
              {...register("name", { required: true })}
              //   value={DynamicEntry.value}
            />
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
            <OutlinedInput
              {...register("multiplier", { required: true })}
              //   value={DynamicEntry.value}
            />
          </Grid>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            sx={{ width: "50%", margin: "auto", mt: "20px" }}
          >
            Generate new address
          </Button>
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}

export default AddAddressForm;
