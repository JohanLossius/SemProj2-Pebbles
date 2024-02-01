import { baseUrl } from "../js/constants/api.js";

// Login validation

const form = document.querySelector(".login-form");

const emailInput = document.querySelector(".email-input");
const passwordInput = document.querySelector(".password-input");

const emailCont = document.querySelector(".email-feedback-container");
const passwordCont = document.querySelector(".password-feedback-container");

const messageCont = document.querySelector(".message-cont");
const submitButton = document.querySelector("#submit-button");

const loginUrl = `${baseUrl}/auction/auth/login`;

/* Log In Code */

/**
 * @param {object} data Passes in the data from the submit event
 * @property {string} token Sets the accessToken that is returned from the login api call, later to be set to local storage.
 * @property {string} profilePictureUrl Sets the profilePicture url, if submitted upon registration, to the local storage, to display on profile later, without having to do an APi call for it after the user is logged in.
 * @property {string} username Sets the username of the person, that is aggregated from both the first and the last name with an underscore, to be set to local storage. To access the Author name later to make API calls, and populate profile data etc.
 * @function Checks if both input fields of password and email are filled out. If no, tells user to do so. If yes, it populates the options container to make an api call, based on the data input. THen it makes an attempt to login with an API call, and if successful sets the local storage and redirects the user to the feed as logged in. If the login was unsuccessful, it instructs the user with the dynamic error message how to correct it.
 */
form.addEventListener("submit", async (data) => {
  data.preventDefault();

  localStorage.clear();

  if (!passwordInput.value || !emailInput.value) {
    messageCont.innerHTML = `<span class="error-message">Please fill in your email and password to log in.</span>`;
  }
  
  if (passwordInput.value && emailInput.value) {

    const emailConst = emailInput.value;
    const passwordConst = passwordInput.value;

    const emailConstLower = emailConst.toLowerCase();
       
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        email: `${emailConstLower}`,
        password: `${passwordConst}`,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };
        
    console.log("RequestOptions: ", requestOptions);
        
    try {
      const resp = await fetch(loginUrl, requestOptions);
      const json = await resp.json();

      if (!resp.ok) {
				throw new Error(json.errors[0].message);
			}

      const token = json.accessToken;
      const profilePictureUrl = json.avatar;
      const username = json.name;
      localStorage.setItem("username", username);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("profilePictureUrl", profilePictureUrl);
      localStorage.setItem("loggedIn", true);

      if (resp.ok) {
        const profileOptions = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        messageCont.innerHTML = ` <div class="success-message">You are now successfully logged in. If the listings feed doesn't load automatically, click here:</div>
                                  <a href="listings.html" class="m-2 btn btn-primary" title="Pebbles Listings">Listings</a>`;
        window.location.href = "listings.html";

      }
    } catch (error) {
      console.log(error);
      messageCont.innerHTML = `<span class="error-message">${error}</span>`;
    }
  }
});