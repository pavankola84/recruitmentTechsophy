import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";


// Customized Alert component for displaying notifications
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


// Notification component for displaying various types of alerts
export default function Notification({
  open,
  type,
  duration,
  message,
  setOpen,
}: any) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={duration || 3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* Customized Alert component to display the message content */}
        <Alert
          severity={type}
          sx={{ width: "100%" }}
          onClose={() => setOpen(false)}
        >
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

/* This Notification component is utilized to display various types of notifications or alerts 
within a React application. The component allows for easy customization of notification 
appearance, including duration, severity, and message content, while also providing options for user 
interaction, such as closing the notification manually.*/
