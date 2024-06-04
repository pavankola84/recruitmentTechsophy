export interface notifyAlert {
  enable: boolean;
  type: string;
  message: string;
  duration: number;
}

export type NotifyEvent = {
  type: "SEND_ALERT";
  data: notifyAlert;
};

export const initialAlertState: notifyAlert = {
  enable: false,
  type: "",
  message: "",
  duration: 0,
};

export default (
  state: notifyAlert = initialAlertState,
  event: NotifyEvent
): notifyAlert => {
  switch (event.type) {
    case "SEND_ALERT":
      return {
        ...state,
        enable: event.data.enable,
        type: event.data.type,
        message: event.data.message,
        duration: event.data.duration,
      };
    default:
      return state;
  }
};
