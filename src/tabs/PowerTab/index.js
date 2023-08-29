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
import mqttPost from "../../utils/mqttPost";
import { useForm } from "react-hook-form";

const PowerTab = ({ liveData, url, mode, mqttClient }) => {
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

    if (mode === "local") {
      try {
        const response = await axios.post(url + "delete-address", request);
        console.log(response.data);
        setFormLoading(false);
      } catch (error) {
        setFormLoading(false);
        console.error(error);
      }
    } else if (mode === "remote") {
      mqttPost(
        mqttClient,
        "/delete-address",
        "/delete-address/response",
        request,
        () => {
          setFormLoading(false);
        }
      );
    }
  };

  const [dynamicForms, SetDynamicForms] = useState([]);

  const onDynamicFormChange = (e, index, key) => {
    //if dynamicForms array entry of index (index) object has a key of (key) set the value of the key to event value
    //else create a new object with the key and value and push it to the dynamicForms array
    let dynamicFormsCopy = [...dynamicForms];
    if (dynamicFormsCopy[index]) {
      dynamicFormsCopy[index][key] = {};
      dynamicFormsCopy[index][key]["value"] = e.target.value;
      dynamicFormsCopy[index][key]["editing"] = true;
    }
    if (!dynamicFormsCopy[index]) {
      dynamicFormsCopy[index] = {};
      dynamicFormsCopy[index][key] = {};

      dynamicFormsCopy[index][key]["value"] = e.target.value;
      dynamicFormsCopy[index][key]["editing"] = true;
    }

    SetDynamicForms(dynamicFormsCopy);
  };

  function renderDynamicRows(liveData) {
    return (
      <Grid container spacing={3}>
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
          >
            <div
              style={{
                border: ".5px #afafaf solid",
                marginTop: "0px",
                height: "15px",
              }}
            ></div>
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
        {/* ------------------- */}
        <Grid item xs={12}>
          <div style={{ border: ".5px #afafaf solid", marginTop: "0px" }}></div>
        </Grid>
        {/* ------------------- */}
        <>
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
        </>
        {/* ------------------- */}
        {liveData.dynamic.map((DynamicEntry, index) => {
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
                <OutlinedInput
                  sx={{
                    bgcolor:
                      dynamicForms[index]?.a?.value === DynamicEntry.a ||
                      !dynamicForms[index]?.a?.editing
                        ? "white"
                        : "#fff4e3",
                  }}
                  value={
                    dynamicForms[index]?.a?.editing
                      ? dynamicForms[index]?.a?.value
                      : DynamicEntry.a
                  }
                  id="controlled-text-field"
                  size="small"
                  onChange={(e) => onDynamicFormChange(e, index, "a")}
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
                  sx={{
                    bgcolor:
                      dynamicForms[index]?.n?.value === DynamicEntry.n ||
                      !dynamicForms[index]?.n?.editing
                        ? "white"
                        : "#fff4e3",
                  }}
                  value={
                    dynamicForms[index]?.n?.editing
                      ? dynamicForms[index]?.n?.value
                      : DynamicEntry.n
                  }
                  id="controlled-text-field"
                  size="small"
                  onChange={(e) => onDynamicFormChange(e, index, "n")}
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
                  sx={{
                    bgcolor:
                      dynamicForms[index]?.x?.value === DynamicEntry.x ||
                      !dynamicForms[index]?.x?.editing
                        ? "white"
                        : "#fff4e3",
                  }}
                  value={
                    dynamicForms[index]?.x?.editing
                      ? dynamicForms[index]?.x?.value
                      : DynamicEntry.x
                  }
                  id="controlled-text-field"
                  size="small"
                  onChange={(e) => onDynamicFormChange(e, index, "x")}
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
                  inputProps={{ readOnly: true }}
                  value={DynamicEntry.v}
                  id="controlled-text-field"
                  size="small"
                />
              </Grid>
            </>
          );
        })}
        {/* ------------------- */}
        {
          <AddAddressForm
            formState={formState}
            index={liveData?.dynamic?.length}
            dynamicData={liveData?.dynamic}
            dynamicForms={dynamicForms}
            setAllowFormInput={setAllowFormInput}
            fromLoading={fromLoading}
            setFormLoading={setFormLoading}
            url={url}
            mode={mode}
            mqttClient={mqttClient}
          />
        }
      </Grid>
    );
  }

  function renderStaticRows(liveData) {
    if (!liveData?.static) return <></>;
    if (liveData?.static?.length === 0) return <></>;

    let staticData = liveData.static;
    let staticDataArray = [
      {
        reading: "Time data sent",
        value: staticData.t,
        units: "--",
      },
      {
        reading: "Voltage 1 RMS",
        value: staticData.a,
        units: "V",
      },
      {
        reading: "Voltage 2 RMS",
        value: staticData.b,
        units: "V",
      },
      {
        reading: "Voltage 3 RMS",
        value: staticData.c,
        units: "V",
      },
      {
        reading: "Current 1 RMS",
        value: staticData.d,
        units: "A",
      },
      {
        reading: "Current 2 RMS",
        value: staticData.e,
        units: "A",
      },
      {
        reading: "Current 3 RMS",
        value: staticData.g,
        units: "A",
      },
      {
        reading: "frequency",
        value: staticData.f,
        units: "Hz",
      },
      {
        reading: "Neutral Current",
        value: staticData.h,
        units: "A",
      },
      {
        reading: "Temp1",
        value: staticData.temp1,
        units: "C",
      },
      {
        reading: "Temp2",
        value: staticData.temp2,
        units: "C",
      },
      {
        reading: "Temp3",
        value: staticData.temp3,
        units: "C",
      },
    ];
    return (
      <Grid
        container
        spacing={4}
        sx={{ m: "0px !important", mt: "5px", width: "100%", pb: "40px" }}
      >
        <Grid
          item
          xs={4}
          sx={{
            textAlign: "right",
            display: "flex",
            mb: "24px",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.4rem",
          }}
        >
          Reading
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
            fontSize: "1.4rem",
            mb: "24px",
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
            fontSize: "1.4rem",
            mb: "24px",
          }}
        >
          Units
        </Grid>
        {/* ------------------------------ */}
        <Grid xs={12}>
          <div style={{ border: ".5px #afafaf solid" }}></div>
        </Grid>
        {/* ------------------------------ */}
        {staticDataArray.map((staticEntry, index) => {
          return (
            <>
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
                {staticEntry.reading}
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
                <OutlinedInput
                  inputProps={{ readOnly: true }}
                  value={staticEntry.value}
                  id="controlled-text-field"
                  size="small"
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
                {staticEntry.units}
              </Grid>
            </>
          );
        })}
        {/* ------------------------------ */}
      </Grid>
    );
  }

  return (
    <Box sx={{ width: "90%", padding: "20px", m: "auto" }}>
      {liveData?.static && liveData?.static?.length !== 0 ? (
        <Grid container spacing={4}>
          {/* ------------------------------------- */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              border: "1px solid grey",
              padding: "0px !important",
              mt: "50px",
              borderRadius: "10px",
              boxShadow: "-3px 4px 5px #afafaf",
            }}
          >
            {renderStaticRows(liveData)}
          </Grid>
          {/* ------------------------------------ */}
          <Grid item xs={12} md={1}></Grid>
          {/* ------------------------------------ */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              border: "1px solid grey",
              padding: "20px !important",
              mt: "50px",
              borderRadius: "10px",
              boxShadow: "-3px 4px 5px #afafaf",
            }}
          >
            {renderDynamicRows(liveData)}
          </Grid>
          {/* ---------------------------- */}
        </Grid>
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
    </Box>
  );
};

export default PowerTab;
