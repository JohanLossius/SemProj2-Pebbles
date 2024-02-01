import { baseUrl } from "./constants/api.js";
import { passwordCheck, emailCheck, firstNameCheck, lastNameCheck } from "./validation/validation.js";

const form = document.querySelector("#register-form");

const firstNameInput = document.querySelector(".first-name-input");
const lastNameInput = document.querySelector(".last-name-input");
const emailInput = document.querySelector(".email-input");
const passwordInput = document.querySelector(".password-input");
const avatarInput = document.querySelector(".avatar-input");

const firstNameCont = document.querySelector(".first-name-container");
const lastNameCont = document.querySelector(".last-name-container");
const emailCont = document.querySelector(".email-feedback-container");
const passwordCont = document.querySelector(".password-feedback-container");
const avatarCont = document.querySelector(".avatar-feedback-container");

const messageCont = document.querySelector(".message-cont");
const submitButton = document.querySelector("#submit-button");

const signUpUrl = `${baseUrl}/auction/auth/register`;

// Sign Up validation

// First name validation

firstNameInput.addEventListener("change", firstNameInputValidation);

/**
 * @function firstNameInputValidation The function connect the data from the firstName input field, and runs it through the first name validation function as imported from validation.mjs to check if the input is a valid first name. Thereafter it displays either a correction or success message to the user, based on whether the validation returned true or false.
 */
function firstNameInputValidation() {
    if (firstNameCheck(firstNameInput.value) === false) {
        firstNameCont.innerHTML = `<span class="error-message">*Please fill in your first name of at least 2 characters*</span>`;
    } else {
        firstNameCont.innerHTML = `<span class="success-message">*First name looks good*</span>`;
    }
}

// Last name validation

lastNameInput.addEventListener("change", lastNameInputValidation);


/**
 * See JS documentation same as above for "firstNameInputValidation";
 */
function lastNameInputValidation() {
    if (lastNameCheck(lastNameInput.value) === false) {
        lastNameCont.innerHTML = `<span class="error-message">*Please fill in your last name of at least 2 characters*</span>`;
    } else {
        lastNameCont.innerHTML = `<span class="success-message">*Last name looks good*</span>`;
    }
}


// Email validation

emailInput.addEventListener("change", emailInputValidation);

/**
 * See JS documentation same as above for "firstNameInputValidation";
 */
function emailInputValidation() {
    if (emailCheck(emailInput.value) === false) {
        emailCont.innerHTML = `<span class="error-message">*Your email must be a valid email from the "@stud.noroff.no" domain*</span>`;
    } else {
        emailCont.innerHTML = `<span class="success-message">*Email looks good*</span>`;
    }
}

// Password validation

passwordInput.addEventListener("change", passwordInputValidation);

/**
 * See JS documentation same as above for "firstNameInputValidation";
 */
function passwordInputValidation() {
    if (passwordCheck(passwordInput.value) === false) {
        passwordCont.innerHTML = `<span class="error-message">*Your password must be at least 8 characters*</span>`;
    } else {
        passwordCont.innerHTML = `<span class="success-message">*Password looks good*</span>`;
    }
}

// Form submit management

form.addEventListener("submit", signUp);

/**
 * @function signUp Runs all the checks on first name, last name, email, and password, based on their input values, and with the use of the imported validation checks from validation.mjs. The function controls the messaging of the signup form and for the various inputs, and instructs the user what to correct. Please not it mainly functions when there is an error, because if the submission is successful from the api call frmo the async function upon signup, the messaging is overwritten from that async function.
 * @param {object} event Passes in the submit event based on the data submitted into the form, and logs this.
 */
function signUp(event) {
    event.preventDefault();
    console.log("signup event:", event);

    // Manage the first name instructions
    if (firstNameCheck(firstNameInput.value) === false) {
        firstNameCont.innerHTML = `<span class="error-message">*Please fill in your first name of at least 2 characters*</span>`;
    } else {
        firstNameCont.innerHTML = `<span class="success-message">*First name looks good*</span>`;
    }

    // Manage the last name instructions
    if (lastNameCheck(lastNameInput.value) === false) {
        lastNameCont.innerHTML = `<span class="error-message">*Please fill in your last name of at least 2 characters*</span>`;
    } else {
        lastNameCont.innerHTML = `<span class="success-message">*Last name looks good*</span>`;
    }

    // Manage the email instructions
    if (emailCheck(emailInput.value) === false) {
        emailCont.innerHTML = `<span class="error-message">*Please fill in a valid email of a "@stud.noroff.no"-domain*</span>`;
    } else {
        emailCont.innerHTML = `<span class="success-message">*Email looks good*</span>`;
    }

    // Manage the password instructions
    if (passwordCheck(passwordInput.value) === false) {
        passwordCont.innerHTML = `<span class="error-message">*Please fill in your password of at least 8 characters*</span>`;
    } else {
        passwordCont.innerHTML = `<span class="success-message">*Password looks good*</span>`;
    }    
};

/* Register Code */

/**
 * @param data Passes in the data from the submit event.
 * @property {object} requestOptions The options for the API call is dynamically populated with the data inputted by the user into the signup form, and used for the API call to register the user.
 * @property {string} signUpUrl Contains the URL for the user to register his/her profile.
 * @property {string} emailConstLower Because the server distinguishes between upper and lower case letters, also for emails, I decided to convert all emails to lower case, to avoid confusion when the user tries to log in. Because not all services on the web makes that distinction.
 * @function Checks if all the input fields are valid with the imported validation check validation.mjs files. Based on the signUpUrl and the options container for the API request, it tries to register the user. If successful, the username and email are displayed, and the user is being redirected to the login page. If the API register was unsuccessful, the error message is fetched from the network tab (in chrome) in displayed dynamically to the user. If the forms were not filled out properly, the user is being directed to fix this.
 * @returns A registered user with the data to login, as long as the user remembers the password him-/herself, as well as redirection to the login page.
 */
form.addEventListener("submit", async (data) => {
    data.preventDefault();
    console.log("data from signup: ", data);
  
    if (firstNameCheck(firstNameInput.value) && lastNameCheck(lastNameInput.value) && passwordCheck(passwordInput.value) && emailCheck(emailInput.value)) {
        const firstNameConst = firstNameInput.value;
        const lastNameConst = lastNameInput.value;
        const emailConst = emailInput.value;
        const passwordConst = passwordInput.value;
        const avatarConst = avatarInput.value;

        const emailConstLower = emailConst.toLowerCase();

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
              name: `${firstNameConst}_${lastNameConst}`,
              email: `${emailConstLower}`,
              password: `${passwordConst}`,
              avatar: `${avatarConst}`
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          };
        
          console.log("RequestOptions", requestOptions);

        try {
            const resp = await fetch(signUpUrl, requestOptions)
            if(!resp.ok) {
            const json = await resp.json();
            console.log("error json: ", json);
            throw new Error(json.errors[0].message);
            }
            if(resp.ok) {
                messageCont.innerHTML = `<div class="register-success-cont">
                                            <h3 class="m-2 success-message">Your profile was successfully registered, and you can now log in to Pebbles.</h3>
                                            <div class="m-2 success-message">Your username: ${firstNameConst}_${lastNameConst}</div>
                                            <div class="m-2 success-message">Your email: ${emailConstLower}</div>
                                            <a href="login.html" class="btn btn-primary" title="Login page">Log In</a>
                                        </div>`;
                form.reset();
                firstNameCont.innerHTML = ``;
                lastNameCont.innerHTML = ``;
                emailCont.innerHTML = ``;
                passwordCont.innerHTML = ``;
            }
        }
        catch(error) {
            console.log(error);
            messageCont.innerHTML = `<span class="error-message">${error}</span>`
        }
    }
    else {
        messageCont.innerHTML = `<span class="error-message">There was an error, please correct the following:</span>`
    }
});