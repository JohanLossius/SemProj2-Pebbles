/**
 * 
 * @param {string} firstName First name input from sign up page 
 * @returns {boolean} True or false based on nr of characters of name, 2 or more is true
 *
 */
export function firstNameCheck(firstName) {
  const firstNameLength = firstName.trim().length;
  console.log(firstNameLength);
  if (firstNameLength >= 2) {
      return true;
  } else {
      return false;
  }
};

/**
* 
* @param {string} lastName Last name input from sign up page
* @returns {boolean} True or false based on nr of characters of name, 2 or more is true
*/
export function lastNameCheck(lastName) {
  const lastNameLength = lastName.trim().length;
  console.log(lastNameLength);
  if (lastNameLength >= 2) {
      return true;
  } else {
      return false;
  }
};

/**
* 
* @param {string} email email input from sign up page 
* @property {boolean} validEmail returns true or false whether the reg ex algoritm deems the input to be a valid email or not.
* @property {number} studNoroffCont returns -1 if "@stud.noroff.no" is not present in the email input valule, and if it is present, it returns the nr of characters present before "@stud.noroff.no".
* @returns {boolean} returns true or false based on whether the email is a) a valid email based on the RegEx algoritm, and b) if the email is of either the "@noroff.no" or "@stud.noroff.no" domain.
* @example
* ```js
* const studentEmail = "arnulf.larsen@gmail.com";
* emailcheck(studentEmail);
* // Expect the regex validEmail const to be true, but a negative nr - meaning false - for the domain name.
* // Hence the if statement at the end will return false, and user will need to change email input to be able to register.
* ```
*/
export function emailCheck(email) {
  const regEx = /\S+@\S+\.\S+/;
  const validEmail = regEx.test(email);
  console.log(validEmail);

  const studNoroffCont = email.indexOf('@stud.noroff.no');
  console.log("studnoroffcont: ", studNoroffCont);

  if(validEmail === true && studNoroffCont > -1 === true) {
      return true;
  } else {
      return false;
  };
};

/**
* 
* @param {string} password User password input. 
* @property {number} passwordLength Trims any potential blank spaces in the users password input, and return the number of characters present in the user input.
* @returns {boolean} Returns true or false, based on whether the password contains 8 characters or more. False if less, true if more.
*/
export function passwordCheck(password) {
  const passwordLength = password.trim().length;
  console.log(passwordLength);
  if (passwordLength >= 8) {
      return true;
  } else {
      return false;
  }
};