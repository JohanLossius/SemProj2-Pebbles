import { token, usernameConst, profilePictureUrl, loggedIn } from "../js/constants/localStorage.js";
import { profileUrl, profilePicUpdateUrl, allProfileListingsUrl } from "../js/constants/api.js";
import { options } from "../js/constants/headers.js";

// Check if logged in

function isLoggedIn() {
  if (loggedIn) {
    console.log("logged in: ", loggedIn);
    return true;
  } else {
    console.log("logged in: ", loggedIn);
    return false;
  }
};

// Direct user to correct page based on login status

if (isLoggedIn() === false) {
  location.href = "../index.html";
};

// Logout function
/**
 * @function logoutButton This function clears the local storage and redirects the user to the index page.
 */
const logoutButton = document.querySelector('.logout-button');
logoutButton.addEventListener('click', () => {
  localStorage.clear();
  location.href = 'index.html';
});

const profileNameCont = document.querySelector(".profile-name");
profileNameCont.textContent = usernameConst;

const profileFeedbackCont = document.querySelector(".profile-picture-feedback");

const profileImageCont = document.querySelector(".custom-profile-image");
const profileEmailCont = document.querySelector(".profile-email");
const creditCounter = document.querySelector(".custom-credit");

const submitButton = document.querySelector("#custom-submit-button");
const profileUrlInput = document.querySelector(".input-avatar-url");

const profileListingsSection = document.querySelector(".profile-listings-section");
const feedbackCont = document.querySelector(".feedback-cont");

/**
 * @function profileData This function uses the URL that is generated with the author's username, to create an API call that fetches the data about the author, to display it on the profile section of the profile page. The data is dynamically populated with JS into the hardcoded HTML of the web page.
 */
async function profileData() {
  try {
      const response = await fetch(profileUrl, options);
      const json2 = await response.json();

      if(!response.ok) {
        throw new Error(json.errors[0].message);
      }

      let profilePicture = json2.avatar;
      if(profilePicture) {
          profilePicture = json2.avatar;
      } else {
          profilePicture = "../img/blank-profile-picture.png";
      };
      profileImageCont.setAttribute("src", profilePicture);

      let profileEmail = json2.email;

      profileEmailCont.setAttribute("href", `mailto:${profileEmail}`);
      profileEmailCont.textContent = profileEmail;

      let profileCredits = json2.credits;
      creditCounter.textContent = profileCredits;
  }
  catch (error) {
      console.log("error: ", error);
      profileFeedbackCont.innerHTML = `<span class="error-message">${error}</span>`;
  }
}
profileData();

/**
 * @function updateProfileAvatar This function updates the profile picture of the user, based on the input of the user. It uses the PUT method to update the profile picture, and then reloads the page to display the new profile picture.
 * @param {string} profilePictureUrl2 The new profile picture of the user, that is fetched from the API call. It is being set to local storage, to be displayed on the profile page. 
 */

const updateProfileAvatar = submitButton.addEventListener("click", async (data) => {
  data.preventDefault();

  const profileUrlInput = document.querySelector(".input-avatar-url");
  const profileUrlConst = profileUrlInput.value;

  const optionsProfilePut = {
    method: 'PUT',
    body: JSON.stringify({
      avatar: `${profileUrlConst}`,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const resp = await fetch(profilePicUpdateUrl, optionsProfilePut);
    const json = await resp.json();

    const profilePictureUrl2 = json.avatar;
    if (!resp.ok) {
      throw new Error(json.errors[0].message);
    }
    if (resp.ok) {
      localStorage.setItem("profilePictureUrl", profilePictureUrl2);
      location.reload();
    }
  }
  catch (error) {
    console.log(error);
    profileFeedbackCont.innerHTML = `<span class="error-message">${error}</span>`
  }
});


/**
 * @function profileListings This function fetches all the listings of the user, and dynamically populates the HTML of the profile page with the listings.
 */

async function profileListings() {
  try {
    const response = await fetch(allProfileListingsUrl, options);
    const json = await response.json();

    if(!response.ok) {
      throw new Error(json.errors[0].message);
    }

    for (let i = 0; i < json.length; i++) {
        
      let id = json[i].id;

      let title = json[i].title;
      let description = json[i].description;

      let listingPicture = json[i].media[0];
      if (listingPicture) {
        listingPicture = json[i].media[0];
      } else {
        listingPicture = "/img/blank-profile-picture.png";
      }

      let listingRepo = json[i].media[1];
      if (listingRepo) {
        listingRepo = json[i].media[1];
      } else {
        listingRepo = "/img/blank-profile-picture.png";
      }

      let listingLinkedIn = json[i].media[2];
      if (listingLinkedIn) {
        listingLinkedIn = json[i].media[2];
      } else {
        listingLinkedIn = "/img/blank-profile-picture.png";
      }

      let tags = json[i].tags;

      let updated = json[i].updated;
      let updatedFormatted = updated.slice(0, 10);

      let endsAt = json[i].endsAt;
      let endsAtFormatted = endsAt.slice(0, 10);

      const listing = document.createElement("div");
      listing.classList.add("card", "text-center", "mx-auto", "my-2", "card-custom");
      listing.innerHTML += `
        <div class="card-header d-flex justify-content-center flex-column">
          <span class="m-2 title-cont"></span>
          <span class="last-updated-span">Last updated ${updatedFormatted}</span>
        </div>
        <div class="card-body d-flex flex-column m-auto align-items-center">
          <img src="img/blank-profile-picture.png" class="custom-profile-image" alt="Listing Profile Picture">
          <div class="d-flex m-auto justify-content-center p-2">
            <div>
              <a href="github.com" title="GitHub.com" class="btn btn-primary m-2 custom-github-link">GitHub Repo</a>
              <img class="custom-thumbnail custom-thumbnail-github" alt="GitHub profile picture">
            </div>
            <div>
              <a href="Linkedin.com" title="LinkedIn Profile" class="btn btn-primary m-2 custom-linkedin-link">LinkedIn Profile</a>
              <img class="custom-thumbnail custom-thumbnail-linkedin" alt="LinkedIn Profile Picture">
            </div>
          </div>
          <p class="card-text card-text-custom"></p>
          <p class="card-text me-2">Tags:</p>
          <div class="d-flex align-items-center tags-cont">
          </div>
          <p class="card-text me-2">Purchase before:</p>
          <div class="d-flex align-items-center">
            <p class="ms-2 btn btn-primary">${endsAtFormatted}</p>
          </div>
        </div>
        <div class="card-footer d-flex text-center justify-content-center align-items-center flex-column">
          <span class="mt-2">See auction:</span>
          <a href="single-listing.html?id=${id}" class="card-link custom-card-link">
            <img src="/img/money-bag-xxl.png" class="card-img m-2" alt="money-bag-icon">
          </a>
        </div>`;

      listing.querySelector(".title-cont").textContent = title;
      listing.querySelector(".card-text-custom").textContent = description;

      // Iterate through tags and create elements for each tag
      const tagsCont = listing.querySelector(".tags-cont");
      tags.forEach(tag => {
        const singleTag = document.createElement("p");
        singleTag.classList.add("ms-2", "btn", "btn-primary");
        singleTag.textContent = tag;
        tagsCont.appendChild(singleTag);
      });

      listing.querySelector(".custom-profile-image").setAttribute("src", listingPicture);
      listing.querySelector(".custom-thumbnail-github").setAttribute("src", listingRepo);
      listing.querySelector(".custom-thumbnail-linkedin").setAttribute("src", listingLinkedIn);
      listing.querySelector(".custom-card-link").setAttribute("title", title);
      profileListingsSection.appendChild(listing);
    }
  }
  catch (error) {
    console.log("error: ", error);
    feedbackCont.innerHTML = `<span class="m-auto text center error-message">${error}</span>`
  }
};

profileListings();