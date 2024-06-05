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
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCustomStyles from "../../hooks/CustomStylesHook";
import { useTheme } from "@emotion/react";
import { Clear } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { createJob, updateJob } from "../../services/JobService";
import { Country, ICountry, State, City } from "country-state-city";
import {
  getAllClients,
  getAllDepartments,
  getAllSkills,
} from "../../services/DataService";
import { educationOptions } from "./../../constants/addJob";
import { Clients, Departments } from "../../constants/schema";

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
  },
  closeButton: {
    marginRight: "1.5rem",
  },
  textArea: {
    resize: "none",
    outline: "none",
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
  const [clients, setClients] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [skills, setSkills] = useState<any>([]);

  const [errors, setErrors] = useState({
    jobTitle: "",
    experience: "",
    employmentType: "",
    country: "",
    city: "",
    description: "",
    department: "",
    aboutCompany: "",
    education: "",
    keySkills: "",
    clientName: "",
    startDate: "",
    endDate: "",
    status: "",
    openings: "",
    package: "",
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      jobTitle: "",
      experience: "",
      employmentType: "",
      country: "",
      city: "",
      description: "",
      department: "",
      aboutCompany: "",
      education: "",
      keySkills: "",
      clientName: "",
      startDate: "",
      endDate: "",
      status: "",
      openings: "",
      package: "",
    };

    if (!formState.jobTitle) {
      newErrors.jobTitle = "Job Title is required";
      valid = false;
    }

    if (!formState.experience) {
      newErrors.experience = "Experience is required";
      valid = false;
    }
    if (!formState.employmentType) {
      newErrors.employmentType = "Employee Type is required";
      valid = false;
    }
    if (!formState.country) {
      newErrors.country = "Country is required";
      valid = false;
    }
    if (formState.city.length === 0) {
      newErrors.city = "City is required";
      valid = false;
    }
    if (!formState.description) {
      newErrors.description = "Description is required";
      valid = false;
    }
    if (!formState.department) {
      newErrors.department = "Department is required";
      valid = false;
    }
    if (!formState.aboutCompany) {
      newErrors.aboutCompany = "About Company is required";
      valid = false;
    }
    if (formState.education.length === 0) {
      newErrors.education = "Education is required";
      valid = false;
    }
    if (formState.keySkills.length === 0) {
      newErrors.keySkills = "Key Skills is required";
      valid = false;
    }
    if (!formState.startDate) {
      newErrors.startDate = "Start Date is required";
      valid = false;
    }
    if (!formState.endDate) {
      newErrors.endDate = "End Date is required";
      valid = false;
    }
    if (!formState.status) {
      newErrors.status = "Status is required";
      valid = false;
    }
    if (!formState.openings) {
      newErrors.openings = "Openings is required";
      valid = false;
    }
    if (!formState.package) {
      newErrors.package = "Package is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      //add alert
      console.log("Form contains errors");
      return;
    }

    const form = { ...formState, jobId: uuidv4() };
    const response: any = await createJob(form);
    console.log("Adding Job");
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
    if (!validateForm()) {
      //add alert
      console.log("Form contains errors");
      return;
    }

    console.log("Updating Job");
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
    setErrors((prevState) => ({
      ...prevState,
      [key]: "",
    }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const filterCountryWithCode = (code: any) => {
    let contries = Country.getAllCountries();
    let filiteredCountry = contries.filter(
      (country) => country.isoCode === code
    );
    return filiteredCountry[0];
  };

  const filterCountryWithName = (name: any) => {
    let contries = Country.getAllCountries();
    let filiteredCountry = contries.filter((country) => country.name === name);
    return filiteredCountry[0];
  };
  const handleCountryChange = (countryCode: any) => {
    let cities = City.getCitiesOfCountry(countryCode);

    let uniqueNames = new Set();

    let formattedCities: any = cities?.reduce((accumulator: any, item) => {
      if (!uniqueNames.has(item.name)) {
        uniqueNames.add(item.name);
        accumulator.push(item.name);
      }
      return accumulator;
    }, []);

    setCities(formattedCities);
  };

  useEffect(() => {
    setCountries(Country.getAllCountries());
    console.log("countries", Country.getAllCountries());
    const country = filterCountryWithName(formState.country);
    handleCountryChange(country?.isoCode);
  }, []);

  const getData = async () => {
    try {
      const responseClients = await getAllClients();
      const responseDepartments = await getAllDepartments();
      const responseSkills = await getAllSkills();

      const clientNames = responseClients.data.map(
        (client: Clients) => client.clientName
      );
      const departmentNames = responseDepartments.data.map(
        (department: Departments) => department.departmentName
      );
      const skills = responseSkills.data[0].skills;

      setClients(clientNames);
      setDepartments(departmentNames);
      setSkills(skills);
      console.log(skills);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    getData();
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
            error={!!errors.jobTitle}
            helperText={errors.jobTitle}
          />
          <TextField
            type="number"
            label="Openings"
            fullWidth
            required
            value={formState.openings}
            onChange={(e) => handleChange("openings", parseInt(e.target.value))}
            className={classes?.textField}
            error={!!errors.openings}
            helperText={errors.openings}
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <FormControl
            fullWidth
            className={classes?.textField}
            error={!!errors.employmentType}
          >
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
            <FormHelperText>{errors.employmentType}</FormHelperText>
          </FormControl>
          <FormControl
            fullWidth
            className={classes?.textField}
            error={!!errors.experience}
          >
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
            <FormHelperText>{errors.experience}</FormHelperText>
          </FormControl>
        </Box>
        <Box className={classes?.rowFlex}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={formState.startDate ? formatDate(formState.startDate) : ""}
            onChange={(e) =>
              handleChange("startDate", new Date(e.target.value))
            }
            className={classes?.textField}
            error={!!errors.startDate}
            helperText={errors.startDate}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={formState.endDate ? formatDate(formState.endDate) : ""}
            onChange={(e) => handleChange("endDate", new Date(e.target.value))}
            className={classes?.textField}
            error={!!errors.endDate}
            helperText={errors.endDate}
          />
        </Box>
        <Box className={classes?.rowFlex}>
          <FormControl
            fullWidth
            className={classes?.textField}
            error={!!errors.education}
          >
            <Autocomplete
              multiple
              disableCloseOnSelect
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
                  error={!!errors.education}
                  helperText={errors.education}
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

          <FormControl
            fullWidth
            className={classes?.textField}
            error={!!errors.clientName}
          >
            <InputLabel id="client-name-label" required>
              Client Name
            </InputLabel>
            <Select
              labelId="client-name-label"
              value={formState.clientName}
              onChange={(e) =>
                handleChange("clientName", e.target.value as string)
              }
              label="Client Name"
              endAdornment={
                formState.clientName && (
                  <InputAdornment
                    position="end"
                    className={classes?.closeButton}
                  >
                    <IconButton
                      onClick={() => handleClear("clientName")}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }
            >
              {clients.map((clientName) => (
                <MenuItem key={clientName} value={clientName}>
                  {clientName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.clientName}</FormHelperText>
          </FormControl>
        </Box>

        <Box className={classes?.rowFlex}>
          <FormControl
            fullWidth
            className={classes?.textField}
            error={!!errors.country}
          >
            <InputLabel id="country-label" required>
              Country
            </InputLabel>
            <Select
              labelId="country-label"
              value={formState.country}
              onChange={(e) => {
                const value = e.target.value as string;
                handleChange("country", value);
                const country = filterCountryWithName(value);
                handleCountryChange(country?.isoCode);
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
                <MenuItem key={country.isoCode} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.country}</FormHelperText>
          </FormControl>

          <FormControl fullWidth className={classes?.textField}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={cities}
              getOptionLabel={(option) => option}
              value={formState.city}
              onChange={(event, newValue: any) =>
                setFormState((prevState: any) => ({
                  ...prevState,
                  city: newValue,
                }))
              }
              renderInput={(params) => (
                <TextField
                  required
                  label="City"
                  {...params}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              )}
            />
          </FormControl>
        </Box>

        <FormControl
          fullWidth
          className={classes?.textField}
          error={!!errors.description}
        >
          <TextareaAutosize
            minRows={2}
            required
            placeholder="Job Description *"
            value={formState.description}
            onChange={(e) => handleChange("description", e.target.value)}
            style={{
              border: errors.description ? "1px solid red" : "1px solid #ccc",
            }}
            className={`${classes?.textArea} ${classes?.textField}`}
          />
          {errors.description && (
            <FormHelperText error sx={{ marginTop: "-0.8rem" }}>
              {errors.description}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          className={classes?.textField}
          error={!!errors.department}
        >
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
            {departments.map((departmentName) => (
              <MenuItem key={departmentName} value={departmentName}>
                {departmentName}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.department}</FormHelperText>
        </FormControl>
        <FormControl
          fullWidth
          className={classes?.textField}
          error={!!errors.aboutCompany}
        >
          <TextareaAutosize
            minRows={2}
            required
            placeholder="About Company *"
            value={formState.aboutCompany}
            onChange={(e) => handleChange("aboutCompany", e.target.value)}
            style={{
              border: errors.description ? "1px solid red" : "1px solid #ccc",
            }}
            className={`${classes?.textArea} ${classes?.textField}`}
          />
          {errors.aboutCompany && (
            <FormHelperText error sx={{ marginTop: "-0.8rem" }}>
              {errors.aboutCompany}
            </FormHelperText>
          )}
        </FormControl>

        <Box className={classes?.rowFlex}>
          <FormControl fullWidth className={classes?.textField}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={skills}
              getOptionLabel={(option) => option}
              value={formState.keySkills}
              onChange={(event, newValue: any) =>
                setFormState((prevState: any) => ({
                  ...prevState,
                  keySkills: newValue,
                }))
              }
              renderInput={(params) => (
                <TextField
                  required
                  label="Key Skills"
                  {...params}
                  error={!!errors.keySkills}
                  helperText={errors.keySkills}
                />
              )}
            />
          </FormControl>

          <FormControl
            fullWidth
            className={classes?.textField}
            error={!!errors.status}
          >
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
            <FormHelperText>{errors.status}</FormHelperText>
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
