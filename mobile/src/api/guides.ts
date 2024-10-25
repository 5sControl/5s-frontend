import axios from "axios";
const API_GUIDES = "api/new-order/operations/";
const PATH = "https://5scontrol.serveo.net/"
export const getGuides= (cookies: string) => {
    return axios.get(`${PATH}${API_GUIDES}`, {
        headers: {
            Authorization: cookies,
            "ngrok-skip-browser-warning": "true",
        },
    });
};

