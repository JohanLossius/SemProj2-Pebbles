import { allListingsUrl } from "../js/constants/api.js";
import { options } from "../js/constants/headers.js";
import { loggedIn } from "../js/constants/localStorage.js";

// Check if logged in

function isLoggedIn() {
  if (loggedIn) {
    return true;
  } else {
    return false;
  }
};

// Direct user to correct page based on login status

if (isLoggedIn() === true) {
  location.href = "../listings.html";
};

// Listings feed

const listingsSection = document.querySelector(".listing-section");
const feedbackCont = document.querySelector(".feedback-cont");

// To call only right tags

/**
 * @function fetchListingsByTag This function fetches the listings based on the tag that is passed as an argument. It uses the API URL and the options container to make an API call, and then returns the JSON data.
 * @param {string} tag The tag that is used to filter the listings.
 * @returns {array} Returns an array with objects of the JSON data of the listings.
 * @example
 * // fetch listings by frontend tag
 * let tag = "Frontend";
 * fetchListingsByTag(tag);
 * // expect an array with objects of the JSON data of the listing with the tag "Frontend"
 */

let allTags = ["Frontend", "Design", "Backend", "Architecture", "Testing", "Project Management", "DevOps"];

async function fetchListingsByTag(tag) {
  const apiUrlByTag = allListingsUrl + `?_tag=${tag}&_active=true`;

  try {
    const response = await fetch(apiUrlByTag, options);
    const json = await response.json();
    console.log("json fetchlistings by tag: ", json);

    if(!response.ok) {
      throw new Error(json.errors[0].message);
    }
    return json;
  }
  catch (error) {
    console.log(`Error fetching listings by tag: ${tag} `, error);
    return [];
  }
};

/**
 * @function fetchListings This function fetches the listings based on the tags that are passed as an argument. It uses the fetchListingsByTag function to fetch the listings for each tag, and then returns an array of all the fetched listings.  
 * @param {array} tags The array of string tags that is used to fetch the listings.
 * @param {array} fetchedListings The array of fetched listings, that accumulates for each tag that is called by the fetchListingsByTag function.
 * @returns {array} Returns an array with objects of the JSON data of the listings.
 */

async function fetchListings(tags) {
  const fetchedListings = [];
  const rightTags2 = tags;

  for (const tag of rightTags2) {
    const fetchedListingsForTag = await fetchListingsByTag(tag);
    fetchedListings.push(...fetchedListingsForTag);
  }
  return fetchedListings;
};

/**
 * @function listingsFeed This function fetches the listings based on the tags that are passed as an argument, and then dynamically populates the HTML of the listings page with the listings. It uses the fetchListings function to fetch the listings, and then iterates through the fetched listings to create elements for each listing, and then appends the elements to the HTML of the listings page.
 * @param {array} tags An array of strings with all the different tags that are used to fetch the listings.
 * @param {array} listings The array of fetched listings, that accumulates for each tag that is called by the fetchListingsByTag function.
 * 
 */

async function listingsFeed(tags) {
  const rightTags = tags;
  try {
    const listings = await fetchListings(rightTags);

    // To avoid same listings being displayed more than once
    const uniqueListingsIds = [];

    for (let i = 0; i < listings.length; i++) {

      let id = listings[i].id;
      if (!uniqueListingsIds.includes(id)) {
        uniqueListingsIds.push(id);

        let title = listings[i].title;
        let description = listings[i].description;

        let listingPicture = listings[i].media[0];
        if (listingPicture) {
          listingPicture = listings[i].media[0];
        } else {
          listingPicture = "/img/blank-profile-picture.png";
        }

        let listingRepo = listings[i].media[1];
        if (listingRepo) {
          listingRepo = listings[i].media[1];
        } else {
          listingRepo = "/img/blank-profile-picture.png";
        }

        let listingLinkedIn = listings[i].media[2];
        if (listingLinkedIn) {
          listingLinkedIn = listings[i].media[2];
        } else {
          listingLinkedIn = "/img/blank-profile-picture.png";
        }

        let tags = listings[i].tags;

        let updated = listings[i].updated;
        let updatedFormatted = updated.slice(0, 10);

        let endsAt = listings[i].endsAt;
        let endsAtFormatted = endsAt.slice(0, 10);

        const listing = document.createElement("div");
        listing.classList.add("card", "text-center", "mx-auto", "my-2", "card-custom");
        listing.innerHTML += `
          <div class="card-header d-flex justify-content-center flex-column">
            <span class="m-2 title-cont"></span>
            <span class="last-updated-span">Last updated ${updatedFormatted}</span>
          </div>
          <div class="card-body d-flex flex-column m-auto align-items-center">
            <img src="img/blank-profile-picture.png" class="custom-profile-image">
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

        const cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer", "d-flex", "text-center", "justify-content-center", "align-items-center", "flex-column");

        if (isLoggedIn()) {
          cardFooter.innerHTML = `<span class="mt-2">See auction and make bids:</span>
                                  <a href="single-listing.html?id=${id}" class="card-link custom-card-link">
                                    <img src="/img/money-bag-xxl.png" class="card-img m-2" alt="money-bag-icon">
                                  </a>`;
        } else {
          cardFooter.innerHTML = `<span class="mt-2">Please sign up or log in to make bids:</span>
                                  <div class="d-flex justify-content-center">
                                    <a class="p-3 btn btn btn-primary text-center my-4 mx-2" href="signup.html">Sign up</a>
                                    <a class="p-3 btn btn btn-primary text-center my-4 mx-2" href="login.html">Log in</a>
                                  </div>`;
        };

        listing.appendChild(cardFooter);
        listingsSection.appendChild(listing);
      }
    }
  }
  catch (error) {
    console.log("error: ", error);
    feedbackCont.innerHTML = `<span class="m-auto text center error-message">${error}</span>`
  }
};

listingsFeed(allTags);

// Filter by certain tags

const frontendTag = document.querySelector('#tag-div-frontend');
const backendTag = document.querySelector('#tag-div-backend');
const architectureTag = document.querySelector('#tag-div-architecture');
const designTag = document.querySelector('#tag-div-design');
const testingTag = document.querySelector('#tag-div-testing');
const devopsTag = document.querySelector('#tag-div-devops');
const projectManagementTag = document.querySelector('#tag-div-project-management');
const allTagsCont = document.querySelector('#tag-div-all');

/**
 * @method categoryTags This function takes the clicked tag value, and filters the listings feed by the tag value. It also handles the styling of the clicked tag.
 * @param {string} clickedTag The value of the tag that was clicked.
 * @returns It returns the listings feed filtered by the clicked tag value.
 */

const categoryTags = [frontendTag, backendTag, architectureTag, designTag, testingTag, devopsTag, projectManagementTag];

categoryTags.forEach(tag => {
  tag.addEventListener('click', (event) => {
    listingsSection.innerHTML = "";
    let clickedTag = event.target.dataset.tag;

    frontendTag.classList.remove("selected-tag");
    backendTag.classList.remove("selected-tag");
    architectureTag.classList.remove("selected-tag");
    designTag.classList.remove("selected-tag");
    testingTag.classList.remove("selected-tag");
    devopsTag.classList.remove("selected-tag");
    projectManagementTag.classList.remove("selected-tag");
    allTagsCont.classList.remove("selected-tag");

    event.target.classList.add("selected-tag");

    listingsFeed([clickedTag]);
  });
});

/**
 * Same as above for the categoryTags, but for all the tags combined with the allTagsCont and All tags button.
 */

allTagsCont.addEventListener('click', () => {
  listingsSection.innerHTML = "";

  allTagsCont.classList.add("selected-tag");
  
  frontendTag.classList.remove("selected-tag");
  backendTag.classList.remove("selected-tag");
  architectureTag.classList.remove("selected-tag");
  designTag.classList.remove("selected-tag");
  testingTag.classList.remove("selected-tag");
  devopsTag.classList.remove("selected-tag");
  projectManagementTag.classList.remove("selected-tag");

  listingsFeed(allTags);
});
