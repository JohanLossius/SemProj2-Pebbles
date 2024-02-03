import { usernameConst, token, profilePictureUrl } from "../constants/localStorage.js";

const options = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export { options };