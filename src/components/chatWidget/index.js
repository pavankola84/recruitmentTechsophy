import React, { Component } from "react";
import CONSTANTS from "../../constants/constants";
import "./index.css";

class LoadSxpChat extends Component {
  state = {
    userToken: "",
  };

  componentDidMount() {
    this.getUserToken();
  }

  getUserToken = () => {
    const token = sessionStorage.getItem(CONSTANTS.REACT_TOKEN);
    this.setState({ userToken: token }, this.loadIt);
  };

  loadIt = () => {
    const {
      REACT_APP_SOCKET_URL,
      REACT_APP_SOCKET_PATH,
      REACT_APP_GET_SXP_PROJECT_ID,
      REACT_APP_CHAT_FILE_SERVER_URL,
      SXP_TITLE,
      SXP_SUBTITLE,
      SXP_DEFAULT_MSG,
      VERSION_ID,
    } = process.env;

    const mainObj = {
      socketUrl: REACT_APP_SOCKET_URL,
      socketPath: REACT_APP_SOCKET_PATH,
      SSL: true,
      accessToken: `Bearer ${this.state.userToken}`,
      currentProject: REACT_APP_GET_SXP_PROJECT_ID,
      fileServerUrl: REACT_APP_CHAT_FILE_SERVER_URL,
      mainTitle: SXP_TITLE,
      subTitle: SXP_SUBTITLE,
      chatRefresh: true,
      autoLaunch: false,
      lazyAutoLaunch: false,
      editChat: false,
      uploadDoc: true,
      defaultMessage: SXP_DEFAULT_MSG,
      languages: [],
      version: VERSION_ID,
      journeyTray: false,
    };

    window.embedSXPChat(mainObj);
  };

  render() {
    return null;
  }
}

export default LoadSxpChat;
