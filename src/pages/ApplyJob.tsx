import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useCustomStyles from "../hooks/CustomStylesHook";
import { useTheme } from "@emotion/react";
import { StyledTypography } from "./candidateProfile/styles";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
  Autocomplete,
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
import { applyJob, uploadFile } from "../services/JobApplicationService";

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
const experience= [
  "1-3 years",
  "3-5 years",
  "5-7 years",
  "7-9 years",
  "9-12 years",
  "12-15 years",
  "15 and above"
]
// const education=[
//   "PG-Post Graduate",
//   "UG-Under Graduate"
// ]

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
  iframe: {
    width: '100%',
    display: 'flex',
  },
  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '10%',
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
  }
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
  mobile: Yup.string().required("Mobile number is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

interface Job {
  jobId: string;
  jobTitle: string;
}

const ApplyJob: React.FC = () => {
  const theme = useTheme();
  const classes = useCustomStyles(styles, theme);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [file, setFile] = useState(null);
  const [locations, setLocations] = useState([]);
  const [education, setEducation] = useState([]);
  const [fileUrl, setFileUrl]= useState("");
  useEffect(() => {
    const getJobs = async () => {
      const response = await getAllJobs();
      setJobs(response.data);
    };
    getJobs();
    // console.log(jobs)
  }, []);

  const handleUploadFile = async (file: any) => {
    const response = await uploadFile(file);
    if (response.status === 200) {
      const resumeUrl = `${process.env.REACT_APP_API_GATEWAY_URL}${response.data.data.url}`;
      handleFormUploadToApi(resumeUrl);
    }
  };

  useEffect(() => {
    if (file) {
      formik.setFieldValue("resume", file);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  }, [file]);

  const formik = useFormik({
    initialValues: {
      jobId: "",
      emailId: "",
      experience: "",
      location: [],
      education: "",
      panNumber: "",
      aadharNumber: "",
      mobile: "",
      firstName: "",
      lastName: "",
      resume: "",
    },
    validationSchema,
    onSubmit: async(values: any) => {
      console.log("Form Values", values);
      handleFormSubmit();
    },
  });
  const handleChange = (event: any, value: any) => {
    formik.setFieldValue("jobId", value.jobId);
    formik.setFieldValue("location","");
    setLocations(value.location);
    setEducation(value.education);
  };
  const handleFormSubmit= async()=>{
    handleUploadFile(file);
  }
  const handleFormUploadToApi = async (resumeUrl: string) => {
    console.log("entered api upload")
    let formData = formik.values;
    formData.resume = resumeUrl;
    const response = await applyJob(formData);
    console.log(response);
  }
  const deleteFile =()=>{
    formik.setFieldValue("resume", "");
  }
  return (
    <div className={classes?.container}>
      <StyledTypography fontSize="1.5rem" fontWeight="600">
        Techsophy HR
      </StyledTypography>
      <Typography>Job Application Form</Typography>
      <form onSubmit={formik.handleSubmit} className={classes?.formFields}>
        <Box className={classes?.rowFlex}>
          <Autocomplete
            disablePortal
            id="job-field"
            options={jobs}
            getOptionLabel={(option) => option.jobTitle}
            isOptionEqualToValue={(option, value) => option.jobId === value.jobId}
            className={classes?.textField}
            sx={{width: '100%'}}
            renderInput={(params: any) => <TextField {...params} label="Jobs" fullWidth
            error={formik.touched.jobId && Boolean(formik.errors.jobId)} 
            />}
            onChange={(event, value) => { handleChange(event, value) }}
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <Autocomplete
            multiple
            id="locations-select"
            options={locations}
            className={classes?.textField}
            sx={{width: '100%'}}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                placeholder="Select location"
                fullWidth
                error={formik.touched.location && Boolean(formik.errors.location)}
              />
            )}
            onChange={(event, value)=>{formik.setFieldValue("location", value);}}
          />
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
          <Autocomplete
            id="experience-field"
            options={experience}
            className={classes?.textField}
            sx={{width: '100%'}}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Experience"
                placeholder="Experience in years"
                fullWidth
                error={formik.touched.experience && Boolean(formik.errors.experience)}
                helperText={
                  formik.touched.experience && typeof formik.errors.experience === "string"
                    ? formik.errors.experience
                    : ""
                }
              />
            )}
            onChange={(event, value)=>{formik.setFieldValue("experience", value);}}
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
          <Autocomplete
            id="education-field"
            options={education}
            className={classes?.textField}
            sx={{width: '100%'}}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Education"
                placeholder="Education"
                fullWidth
                error={formik.touched.education && Boolean(formik.errors.education)}
                helperText={
                  formik.touched.education &&
                    typeof formik.errors.education === "string"
                    ? formik.errors.education
                    : ""
                }
              />
            )}
            onChange={(event, value)=>{formik.setFieldValue("education", value);}}
          />
        </Box>
        <Box>
          <Typography>Resume upload</Typography>
          <Box >
            {file? 
              <div className={classes?.iframe}>
                <iframe src={fileUrl} width="90%" />
                <div className={classes?.deleteButton}>
                  <DeleteRoundedIcon sx={{height: '40px', width:'40px'}} onClick={deleteFile}/>
                </div>
              </div>
            :
              <FileUpload setFile={setFile} fileTypes={["PDF"]}/>
            }
          </Box>
        </Box>
        <Box className={classes?.submitButton}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default ApplyJob;