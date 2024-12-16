import axios from "axios";

export const disconnectDbAPI = (
  hostname: string,
  token: string,
  id: number
) => {
  const DISCONNECT_CONNECTION = "api/order/delete-connection/";

  return axios.delete(
    `${process.env.REACT_APP_NGROK}${DISCONNECT_CONNECTION}${id}/`,
    {
      headers: {
        Authorization: token,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
};
