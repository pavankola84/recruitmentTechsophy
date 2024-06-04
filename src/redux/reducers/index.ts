import { combineReducers } from "redux";
import NotificationAlert from "./NotificationState";
import UpdateTheme from "./ThemeState";

export default combineReducers({
  NotificationAlert,
  UpdateTheme,
});
