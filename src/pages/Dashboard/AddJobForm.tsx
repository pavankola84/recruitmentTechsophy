import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Autocomplete,
  MenuItem,
  TextField,
  TextareaAutosize,
  Button,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCustomStyles from "../../hooks/CustomStylesHook";
import { useTheme } from "@emotion/react";
import { Clear } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { createJob, updateJob } from "../../services/JobService";
import * as Yup from "yup";
import { Country, ICountry, State, City } from "country-state-city";
import {
  educationOptions,
  keySkillsOptions,
  departmentsAndCategories,
} from "./../../constants/addJob";

interface JobFormProps {
  formData: any;
  handleClose: () => void;
  dialogAction: any;
}

const styles = (theme: any) => ({
  jobAddForm: {
    backgroundColor: "#ffffff",
    padding: "1.5rem",
  },
  heading: {
    color: "#071C50",
    fontWeight: "600",
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
  saveButton: {
    backgroundColor: theme.palette.secondary.main,
    // "&:hover": { backgroundColor:  },
  },
  closeButton: {
    marginRight: "1.5rem",
  },
  textArea: {
    resize: "none",
    outline: "none",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "4px",
  },
  textField: {
    marginBottom: theme.spacing(2),
    "& .MuiInputLabel-root": {
      color: "#969696",
      fontSize: "0.8rem",
    },
    "& .MuiOutlinedInput-root": {
      fontSize: "0.8rem",

      "&.Mui-focused fieldset": {
        borderColor: "#4B93E7",
      },
      "& input": {
        color: "#000",
        fontSize: "0.8rem",
      },
    },
  },
  container: {
    position: "relative",
  },
  addButton: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "black",
    border: "2px solid red",
  },
});

const validationSchema = Yup.object({
  jobId: Yup.string().required("Job is required"),
  employmentType: Yup.string().required("Employment Type is required"),
  jobTitle: Yup.string().required("Job Title is required"),
  experience: Yup.string().required("Experience is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.array().min(1, "At least one city is required"),
  keySkills: Yup.array().min(1, "At least one Key Skill is required"),
  package: Yup.array().min(1, "Package is required"),
  description: Yup.array().min(1, "Description is required"),
  department: Yup.array().min(1, "Department is required"),
  // roleCategory: Yup.array().min(1, "Role Category is required"),
  aboutCompany: Yup.array().min(1, "About Company is required"),
  education: Yup.string().required("Education is required"),
  startDate: Yup.string().required("Start Date is required"),
  endDate: Yup.string().required("End Date is required"),
  status: Yup.string().required("Status is required"),
  openings: Yup.string().required("Openings is required"),
});

const AddJobForm: React.FC<JobFormProps> = ({
  formData,
  handleClose,
  dialogAction,
}) => {
  const theme = useTheme();
  const classes = useCustomStyles(styles, theme);
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    ...formData,
    status: dialogAction === "Add" ? "active" : formData.status || "active",
  
  });

  const [countries, setCountries] = useState<ICountry[]>([]);

  const [cities, setCities] = useState<any>([]);
  const [selectedCities, setSelectedCities] = useState<any>([]);

  const handleAdd = async () => {
    const form = { ...formState, jobId: uuidv4() };
    const response: any = await createJob(form);
    console.log("Adding");
    console.log(response);
    if (response?.success) {
      handleClose();
      dispatch({
        type: "SEND_ALERT",
        data: {
          enable: true,
          type: "success",
          message: response?.message,
          duration: 5000,
        },
      });
    } else {
      dispatch({
        type: "SEND_ALERT",
        data: {
          enable: true,
          type: "error",
          message: response?.message,
          duration: 5000,
        },
      });
    }
  };

  const handleEdit = async () => {
    console.log("Editing");
    const form = { ...formState };
    const response: any = await updateJob(form);
    console.log(response);
    if (response?.success) {
      handleClose();
      dispatch({
        type: "SEND_ALERT",
        data: {
          enable: true,
          type: "success",
          message: response?.message,
          duration: 5000,
        },
      });
    } else {
      dispatch({
        type: "SEND_ALERT",
        data: {
          enable: true,
          type: "error",
          message: response?.message,
          duration: 5000,
        },
      });
    }
  };

  const handleClear = (key: keyof typeof formState): void => {
    setFormState((prevState: any) => ({
      ...prevState,
      [key]: Array.isArray(prevState[key]) ? [] : "",
    }));
  };

  const handleChange = (
    key: keyof typeof formState,
    value: string | number | Date | null | string[]
  ): void => {
    setFormState((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleCountryChange = (countryCode: any) => {
    let cities = City.getCitiesOfCountry(countryCode);

    let uniqueNames = new Set();

    let formattedCities: any = cities?.reduce((accumulator: any, item) => {
        if (!uniqueNames.has(item.name)) { 
            uniqueNames.add(item.name); 
            accumulator.push({ label: item.name, value: item.name });
        }
        return accumulator;
    }, []);

    setCities(formattedCities);
};

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  return (
    <Box className={classes?.jobAddForm}>
      <Box className={classes?.rowFlex}>
        <Typography variant="h6" className={classes?.heading}>
          {dialogAction} Job
        </Typography>
        <IconButton onClick={(event) => handleClose()}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className={classes?.formFields}>
        <Box className={classes?.rowFlex}>
          <TextField
            label="Job Title"
            fullWidth
            required
            value={formState.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            className={classes?.textField}
          />
          <TextField
            type="number"
            label="Openings"
            fullWidth
            required
            value={formState.openings}
            onChange={(e) => handleChange("openings", parseInt(e.target.value))}
            className={classes?.textField}
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <FormControl fullWidth className={classes?.textField}>
            <InputLabel id="employee-type-label" required>
              Employee Type
            </InputLabel>
            <Select
              labelId="employee-type-label"
              value={formState.employmentType}
              onChange={(e) => handleChange("employmentType", e.target.value)}
              label="Employee Type"
              endAdornment={
                formState.employmentType && (
                  <InputAdornment
                    position="end"
                    className={classes?.closeButton}
                  >
                    <IconButton
                      onClick={() => handleClear("employmentType")}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }
            >
              <MenuItem value="full-time">Full Time</MenuItem>
              <MenuItem value="part-time">Part Time</MenuItem>
              <MenuItem value="internship">Internship</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes?.textField}>
            <InputLabel id="experience-label" required>
              Required Experience
            </InputLabel>
            <Select
              labelId="experience-label"
              value={formState.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              label="Required Experience"
              endAdornment={
                formState.experience && (
                  <InputAdornment
                    position="end"
                    className={classes?.closeButton}
                  >
                    <IconButton
                      onClick={() => handleClear("experience")}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }
            >
              <MenuItem value="1-3 years">1-3 years</MenuItem>
              <MenuItem value="3-5 years">3-5 years</MenuItem>
              <MenuItem value="5-7 years">5-7 years</MenuItem>
              <MenuItem value="7-9 years">7-9 years</MenuItem>
              <MenuItem value="9 and above">9 and above</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box className={classes?.rowFlex}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={formState.startDate}
            onChange={(e) =>
              handleChange(
                "startDate",
                new Date(e.target.value).toISOString().split("T")[0]
              )
            }
            className={classes?.textField}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={formState.endDate}
            onChange={(e) =>
              handleChange(
                "endDate",
                new Date(e.target.value).toISOString().split("T")[0]
              )
            }
            className={classes?.textField}
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <FormControl fullWidth className={classes?.textField}>
            <Autocomplete
              multiple
              options={educationOptions}
              getOptionLabel={(option) => option.label}
              value={formState.education.map((education: any) =>
                educationOptions.find((option) => option.value === education)
              )}
              onChange={(event, newValue) =>
                handleChange(
                  "education",
                  newValue.map((option) => option.value)
                )
              }
              renderInput={(params) => (

                <TextField
                  required
                  {...params}
                  label="Education"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </FormControl>

          <TextField
            label="Client Name"
            fullWidth
            value={formState.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
            className={classes?.textField}
          />
        </Box>

        <Box className={classes?.rowFlex}>
          <FormControl fullWidth className={classes?.textField}>
            <InputLabel id="country-label" required>
              Country
            </InputLabel>
            <Select
              labelId="country-label"
              value={formState.country}
              onChange={(e) => {
                const value = e.target.value as string;
                handleChange("country", value);
                handleCountryChange(value);
              }}
              label="Country"
              endAdornment={
                formState.country && (
                  <InputAdornment
                    position="end"
                    className={classes?.closeButton}
                  >
                    <IconButton
                      onClick={() => handleClear("country")}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }
            >
              {countries.map((country) => (
                <MenuItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes?.textField}>
            <Autocomplete
              multiple
              options={cities}
              getOptionLabel={(option) => option?.label}
              value={formState.city.map((city: any) =>
                console.log(cities.find((option: any) => option.value === city))
              )}
              onChange={(event, newValue) => {
                handleChange(
                  "city",
                  newValue.map((option) => option.value)
                )
                setSelectedCities(newValue)
              }
              }
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="City"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </FormControl>
        </Box>

        <TextareaAutosize
          minRows={2}
          required
          placeholder="Job Description *"
          value={formState.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={`${classes?.textArea} ${classes?.textField}`}
        />

        <FormControl fullWidth className={classes?.textField}>
          <InputLabel id="department-type-label" required>
            Department
          </InputLabel>
          <Select
            labelId="department-type-label"
            value={formState.department}
            onChange={(e) =>
              handleChange("department", e.target.value as string)
            }
            label="Department"
            endAdornment={
              formState.department && (
                <InputAdornment position="end" className={classes?.closeButton}>
                  <IconButton
                    onClick={() => handleClear("department")}
                    edge="end"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              )
            }
          >
            {Object.keys(departmentsAndCategories).map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextareaAutosize
          minRows={2}
          required
          placeholder="About Company *"
          value={formState.aboutCompany}
          onChange={(e) => handleChange("aboutCompany", e.target.value)}
          className={`${classes?.textArea} ${classes?.textField}`}
        />

        <Box className={classes?.rowFlex}>
          <FormControl fullWidth className={classes?.textField}>
            <Autocomplete
              multiple
              options={keySkillsOptions}
              getOptionLabel={(option) => option.label}
              value={formState.keySkills.map((skill: any) =>
                keySkillsOptions.find((option) => option.value === skill)
              )}
              onChange={(event, newValue) =>
                handleChange(
                  "keySkills",
                  newValue.map((option) => option.value)
                )
              }
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="Key Skills"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth className={classes?.textField}>
            <InputLabel id="status-type-label" required>
              Status
            </InputLabel>
            <Select
              labelId="status-type-label"
              value={formState.status}
              onChange={(e) => handleChange("status", e.target.value as string)}
              label="Status"
              disabled={dialogAction === "Add"}
              endAdornment={
                dialogAction === "Edit" &&
                formState.status && (
                  <InputAdornment
                    position="end"
                    className={classes?.closeButton}
                  >
                    <IconButton
                      onClick={() => handleClear("status")}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          className={classes?.saveButton}
          onClick={dialogAction === "Add" ? handleAdd : handleEdit}
        >
          {dialogAction} Job
        </Button>
      </Box>
    </Box>
  );
};

export default AddJobForm;
