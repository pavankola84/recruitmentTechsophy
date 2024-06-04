import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useCustomStyles from "../hooks/CustomStylesHook";
import { useTheme } from "@emotion/react";
import { StyledTypography } from "./candidateProfile/styles";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { getAllJobs } from "../services/JobService";
import FileUpload from "../components/FileUpload";
import { uploadFile } from "../services/JobApplicationService";

const cities = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
];

const styles = (theme: any) => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  textField: {
    marginBottom: 2,
    "& .MuiInputLabel-root": {
      color: "#969696",
      fontSize: "0.9rem",
    },
    "& .MuiOutlinedInput-root": {
      fontSize: "0.9rem",
      "&.Mui-focused fieldset": {
        borderColor: "#4B93E7",
      },
      "& input": {
        color: "#000",
        fontSize: "0.9rem",
      },
    },
  },
  formFields: {
    marginTop: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  rowFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
});

const validationSchema = Yup.object({
  jobId: Yup.string().required("Job is required"),
  emailId: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  experience: Yup.string().required("Experience is required"),
  location: Yup.array().min(1, "At least one location is required"),
  education: Yup.string().required("Education is required"),
  resume: Yup.string().required("Resume is required"),
  panNumber: Yup.string().required("PAN number is required"),
  aadharNumber: Yup.string().required("Aadhar number is required"),
  status: Yup.string().required("Status is required"),
  mobile: Yup.string().required("Mobile number is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

const ApplyJob = () => {
  const theme = useTheme();
  const classes = useCustomStyles(styles, theme);
  const [jobs, setJobs] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const getJobs = async () => {
      const response = await getAllJobs();
      setJobs(response.data);
    };
    getJobs();
  }, []);

  const handleUpload = async (file: any) => {
    const response = await uploadFile(file);
    if (response.status === 200) {
      const resumeUrl = `${process.env.REACT_APP_API_GATEWAY_URL}${response.data.data.url}`;
      formik.setFieldValue("resume", resumeUrl);
    }
  };

  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  const formik = useFormik({
    initialValues: {
      jobId: "",
      emailId: "",
      experience: "",
      location: [],
      education: "",
      resume: "",
      panNumber: "",
      aadharNumber: "",
      status: "",
      mobile: "",
      firstName: "",
      lastName: "",
    },
    validationSchema,
    onSubmit: (values: any) => {
      console.log("Form Values", values);
      // Handle form submission here
    },
  });

  return (
    <div className={classes?.container}>
      <StyledTypography fontSize="1.5rem" fontWeight="600">
        Techsophy HR
      </StyledTypography>
      <Typography>Job Application Form</Typography>
      <form onSubmit={formik.handleSubmit} className={classes?.formFields}>
        <Box className={classes?.rowFlex}>
          <FormControl fullWidth className={classes?.textField}>
            <InputLabel id="Job-label">Jobs</InputLabel>
            <Select
              labelId="Job-label"
              value={formik.values.jobId}
              onChange={formik.handleChange}
              label="jobId"
              name="jobId"
              error={formik.touched.jobId && Boolean(formik.errors.jobId)}
              //   helperText={formik.touched.jobId && formik.errors.jobId}
            >
              {jobs.map((job: any) => (
                <MenuItem key={job.jobId} value={job.jobId}>
                  {job?.jobTitle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className={classes?.rowFlex}>
          <FormControl fullWidth className={classes?.textField}>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              multiple
              value={formik.values.location}
              onChange={formik.handleChange}
              label="Location"
              name="location"
              endAdornment={
                formik.values.location.length > 0 && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => formik.setFieldValue("location", [])}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }
              error={formik.touched.location && Boolean(formik.errors.location)}
              //   helperText={formik.touched.location && formik.errors.location}
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className={classes?.rowFlex}>
          <TextField
            label="First Name"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.firstName}
            name="firstName"
            className={classes?.textField}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={
              formik.touched.firstName &&
              typeof formik.errors.firstName === "string"
                ? formik.errors.firstName
                : ""
            }
          />

          <TextField
            label="Last Name"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.lastName}
            name="lastName"
            className={classes?.textField}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={
              formik.touched.lastName &&
              typeof formik.errors.lastName === "string"
                ? formik.errors.lastName
                : ""
            }
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <TextField
            label="Email ID"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.emailId}
            name="emailId"
            className={classes?.textField}
            error={formik.touched.emailId && Boolean(formik.errors.emailId)}
            helperText={
              formik.touched.emailId &&
              typeof formik.errors.emailId === "string"
                ? formik.errors.emailId
                : ""
            }
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <TextField
            label="Experience"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.experience}
            name="experience"
            className={classes?.textField}
            error={
              formik.touched.experience && Boolean(formik.errors.experience)
            }
            helperText={
              formik.touched.experience &&
              typeof formik.errors.experience === "string"
                ? formik.errors.experience
                : ""
            }
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <TextField
            label="PAN Number"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.panNumber}
            name="panNumber"
            className={classes?.textField}
            error={formik.touched.panNumber && Boolean(formik.errors.panNumber)}
            helperText={
              formik.touched.panNumber &&
              typeof formik.errors.panNumber === "string"
                ? formik.errors.panNumber
                : ""
            }
          />
          <TextField
            label="Aadhar Number"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.aadharNumber}
            name="aadharNumber"
            className={classes?.textField}
            error={
              formik.touched.aadharNumber && Boolean(formik.errors.aadharNumber)
            }
            helperText={
              formik.touched.aadharNumber &&
              typeof formik.errors.aadharNumber === "string"
                ? formik.errors.aadharNumber
                : ""
            }
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <TextField
            label="Status"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.status}
            name="status"
            className={classes?.textField}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={
              formik.touched.status && typeof formik.errors.status === "string"
                ? formik.errors.status
                : ""
            }
          />
          <TextField
            label="Mobile"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.mobile}
            name="mobile"
            className={classes?.textField}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={
              formik.touched.mobile && typeof formik.errors.mobile === "string"
                ? formik.errors.mobile
                : ""
            }
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <TextField
            label="Education"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.education}
            name="education"
            className={classes?.textField}
            error={formik.touched.education && Boolean(formik.errors.education)}
            helperText={
              formik.touched.education &&
              typeof formik.errors.education === "string"
                ? formik.errors.education
                : ""
            }
          />
        </Box>
        <Box>
          <Typography>Resume upload</Typography>
          <Box display="flex" flexDirection="row">
            <FileUpload setFile={setFile} fileTypes={["PDF"]} />
            {formik.values.resume && (
              <iframe src={formik.values.resume} width="100%" height="40%" />
            )}
          </Box>
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ApplyJob;
