import React, { useState } from "react";

// ** MUI Imports
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import { useForm } from "react-hook-form";
import axios from "axios";

function AddAddressForm({ index, fromLoading, setFormLoading, url }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    setFormLoading(true);
    try {
      const response = await axios.post(url + "add-address", data);
      console.log(response.data);
      setFormLoading(false);
    } catch (error) {
      setFormLoading(false);
      console.error(error);
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
