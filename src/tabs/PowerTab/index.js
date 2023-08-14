import * as React from "react";

import { useEffect, useState } from "react";

import AddAddressForm from "./components/AddAddressForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
// ** MUI Imports
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useForm } from "react-hook-form";

function renderDynamicRows(liveData) {
  if (!liveData?.dynamic) return <></>;
  if (liveData?.dynamic?.length === 0) return <></>;

  return liveData.dynamic.map((DynamicEntry, index) => {
    return (
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
          {DynamicEntry.address}
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
          {DynamicEntry.varName}
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
          {DynamicEntry.multiplier}
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
            inputProps={{ readOnly: true }}
            value={DynamicEntry.value}
            id="controlled-text-field"
          />
        </Grid>
      </>
    );
  });
}

const PowerTab = ({ liveData, url }) => {
  let gotLiveData = !!liveData ? true : false;
  const [formState, setFormState] = useState("allHidden"); // allHidden,inputHidden, allVisible, allLoading
  const [allowFormInput, setAllowFormInput] = useState(false);
  const [fromLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!gotLiveData) {
      setFormState("allHidden");
    } else if (fromLoading) {
      setFormState("allLoading");
    } else if (!allowFormInput) {
      setFormState("inputHidden");
    } else {
      setFormState("allVisible");
    }
  }, [gotLiveData, allowFormInput, fromLoading]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    //parse string to integer
    const deletedIndex = parseInt(data.address);
    let newData = liveData.dynamic.filter(
      (item, index) => index !== deletedIndex
    );

    const request = { count: newData.length, data: newData };
    console.log(request);
    setFormLoading(true);
    try {
      const response = await axios.post(url + "delete-address", request);
      console.log(response.data);
      setFormLoading(false);
    } catch (error) {
      setFormLoading(false);
      console.error(error);
    }
  };

  return (
    <Box sx={{ width: "100%", padding: "20px" }}>
      <Grid container spacing={2}>
        {/* ------------------------------------- */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
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
              Reading
            </Grid>
            <Grid
              item
              xs={6}
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
              xs={3}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              Units
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
              Time data sent
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.time}
                id="controlled-text-field"
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
              --
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
              Voltage 1 RMS
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.v1RMS}
                id="controlled-text-field"
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
              Volts
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
              Voltage 2 RMS
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.v2RMS}
                id="controlled-text-field"
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
              Volts
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
              Voltage 3 RMS
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.v3RMS}
                id="controlled-text-field"
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
              Volts
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
              Current 1 RMS
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.c1RMS}
                id="controlled-text-field"
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
              Amperes
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
              Current 2 RMS
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.c2RMS}
                id="controlled-text-field"
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
              Amperes
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
              Current 3 RMS
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.c3RMS}
                id="controlled-text-field"
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
              Amperes
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
              Frequency
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.frequency}
                id="controlled-text-field"
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
              Hz
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
              Neutral Current
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.cNeutral}
                id="controlled-text-field"
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
              Amperes
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
              Temp1
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.temp1}
                id="controlled-text-field"
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
              K
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
              Temp2
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.temp2}
                id="controlled-text-field"
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
              K
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
              Temp3
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: "right",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OutlinedInput
                inputProps={{ readOnly: true }}
                value={liveData?.static?.temp3}
                id="controlled-text-field"
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
              K
            </Grid>
            {/* ------------------- */}
          </Grid>
        </Grid>
        {/* ------------------------------------ */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {formState !== "allHidden" && (
              <>
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
                  <Button
                    variant="contained"
                    sx={{ width: "100%" }}
                    onClick={() => {
                      setAllowFormInput(true);
                    }}
                  >
                    Add address
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></Grid>
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
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    color="error"
                    sx={{ width: "100%" }}
                  >
                    Delete Address
                  </Button>
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
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="index to delete"
                    variant="outlined"
                    {...register("address", { required: true })}
                  />
                </Grid>
              </>
            )}
            {/* ------------------- */}
            <Grid
              item
              xs={12}
              sx={{
                mt: 2,
              }}
            ></Grid>
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
              Reading Number
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
              Address
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
              Variable Name
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
              Multiplier
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
              Value
            </Grid>
            {/* ------------------- */}

            {liveData?.dynamic && liveData?.dynamic?.length > 0 ? (
              renderDynamicRows(liveData)
            ) : (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  height: "200px",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {formState !== "inputHidden" && formState !== "allHidden" && (
              <AddAddressForm
                index={liveData?.dynamic?.length}
                dynamicData={liveData?.dynamic}
                setAllowFormInput={setAllowFormInput}
                fromLoading={fromLoading}
                setFormLoading={setFormLoading}
                url={url}
              />
            )}

            {/* ------------------- */}
          </Grid>
        </Grid>
        {/* ------------------------------------- */}
      </Grid>
    </Box>
  );
};

export default PowerTab;
