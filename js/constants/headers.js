import { usernameConst, token, profilePictureUrl } from "../constants/localStorage.js";

const options = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};


// PUT options, profile image update

// const profileUrlInput = document.querySelector(".input-avatar-url");
// const profileUrlConst = profileUrlInput.value;
// console.log("profileUrlConst: ", profileUrlConst);

// const optionsProfilePut = {
//   method: 'PUT',
//   body: JSON.stringify({
//     avatar: `${profileUrlConst}`,
//   }),
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8',
//     Authorization: `Bearer ${token}`,
//   },
// };

export { options };