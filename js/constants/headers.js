import { token } from "../constants/localStorage.js";

const options = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export { options };