// Logout function
/**
 * @function logoutButton This function clears the local storage and redirects the user to the index page.
 */
const logoutButton = document.querySelector('.logout-button');
logoutButton.addEventListener('click', () => {
  localStorage.clear();
  location.href = 'index.html';
});

// Display/hide new listing form

const newListingButton = document.querySelector('.new-listing-button');
const newListingForm = document.querySelector('.custom-form-new-listing');

newListingButton.addEventListener('click', () => {
  newListingForm.classList.toggle('d-none');
});

// Create new listing

/**
 * @newListingForm This function takes the input from the form, and creates a new listing and posts it to the API.
 * @profilePicUrls This function takes the input from the form, and creates an array of profile picture urls.
 * @tagsInputsValues This function takes the input from the form, and creates an array of tag values.
 * @returns It returns the values of the inputs used to create the API, as well as the created & updated at dates, as well as the unique ID of the listing.
 */

const submitButton = document.querySelector('#submit-button');
const feedbackCont = document.querySelector(".feedback-cont");

import { createListingUrl, allProfileListingsUrl, allListingsUrl, allListingsUrlSorted } from "../js/constants/api.js";
import { token } from "../js/constants/localStorage.js";
import { options } from "../js/constants/headers.js";

newListingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("data: ", event);

  const title = document.querySelector(".post-message-title").value;
  const description = document.querySelector(".custom-description-new-listing").value;

  // Create array of profile picture urls
  const profilePicUrl1 = document.querySelector(".profile-pic-url-1").value;
  const profilePicUrl2 = document.querySelector(".profile-pic-url-2").value;
  const profilePicUrl3 = document.querySelector(".profile-pic-url-3").value;
  const profilePicUrls = [profilePicUrl1, profilePicUrl2, profilePicUrl3].filter(url => url.trim() !== "");
  console.log("profilePicUrls: ", profilePicUrls);

  // Create array from tag input values
  const tagsInputs = document.querySelectorAll(".select-competence-categories-section input[type='checkbox']:checked");
  const tagsInputsValues = Array.from(tagsInputs).map(input => input.value);
  console.log("tagsInputsValues: ", tagsInputsValues);

  // Make date format compatible with API
  const purchaseBefore = document.querySelector(".purchase-before-input").value;
  const purchaseBeforeFormatted = `${purchaseBefore}T00:00:00.000Z`;

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      title: `${title}`,
      description: `${description}`,
      media: profilePicUrls,
      tags: tagsInputsValues,
      endsAt: `${purchaseBeforeFormatted}`
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${token}`,
    },
  };

  console.log("requestOptions: ", requestOptions);

  try {
    const response = await fetch(createListingUrl, requestOptions);
    console.log("Response: ", response);

    const json = await response.json();
    console.log("json: ", json);
    
    if (!response.ok) {
      throw new Error(json.errors[0].message);
    }
    newListingForm.reset();
    feedbackCont.innerHTML = `<span class="success-message">Your listing was successfully posted!</span>`;
    newListingForm.classList.toggle('d-none');
    listingsFeed();
  }
  catch (error) {
    console.log(error);
    feedbackCont.innerHTML = `<span class="error-message">${error}</span>`
  }
  finally {
    window.location.href = '#';
  }
});


// Listings feed

const listingsSection = document.querySelector(".listings-listings-section");

// To call only right tags

const rightTags = ["Frontend", "Design", "Backend", "Architecture", "Testing", "Project Management", "DevOps"];

async function fetchListingsByTag(tag) {
  const apiUrlByTag = allListingsUrl + `?_tag=${tag}`;

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

async function fetchListings() {
  const fetchedListings = [];

  for (const tag of rightTags) {
    const fetchedListingsForTag = await fetchListingsByTag(tag);
    fetchedListings.push(...fetchedListingsForTag);
  }
  return fetchedListings;
};

async function listingsFeed() {
  try {
    const listings = await fetchListings();

    console.log("listings: ", listings);

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
          </div>
          <div class="card-footer d-flex text-center justify-content-center align-items-center flex-column">
            <span class="mt-2">See auction and make bids:</span>
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
        listingsSection.appendChild(listing);
      }
    }
  }
  catch (error) {
    console.log("error: ", error);
    listingsSection.innerHTML = `<span class="m-auto text center error-message">${error}</span>`
  }
};

listingsFeed();

// async function listingsFeed() {
//   try {
//     const response2 = await fetch(allListingsUrl, options);
//     console.log("Response2: ", response2);

//     const json2 = await response2.json();
//     console.log("json2: ", json2);

//     if(!response2.ok) {
//       throw new Error(json2.errors[0].message);
//     }

//     for (let i = 0; i < json2.length; i++) {
        
//       let id = json2[i].id;

//       let title = json2[i].title;
//       let description = json2[i].description;

//       let listingPicture = json2[i].media[0];
//       if (listingPicture) {
//         listingPicture = json2[i].media[0];
//       } else {
//         listingPicture = "/img/blank-profile-picture.png";
//       }

//       let listingRepo = json2[i].media[1];
//       if (listingRepo) {
//         listingRepo = json2[i].media[1];
//       } else {
//         listingRepo = "/img/blank-profile-picture.png";
//       }

//       let listingLinkedIn = json2[i].media[2];
//       if (listingLinkedIn) {
//         listingLinkedIn = json2[i].media[2];
//       } else {
//         listingLinkedIn = "/img/blank-profile-picture.png";
//       }

//       let tags = json2[i].tags;

//       let updated = json2[i].updated;
//       let updatedFormatted = updated.slice(0, 10);

//       let endsAt = json2[i].endsAt;
//       let endsAtFormatted = endsAt.slice(0, 10);

//       // TESTTESTTESTTEST

//       const listing = document.createElement("div");
//       listing.classList.add("card", "text-center", "mx-auto", "my-2", "card-custom");
//       listing.innerHTML += `
//         <div class="card-header d-flex justify-content-center flex-column">
//           <span class="m-2 title-cont"></span>
//           <span class="last-updated-span">Last updated ${updatedFormatted}></span>
//         </div>
//         <div class="card-body d-flex flex-column m-auto align-items-center">
//           <img src="img/blank-profile-picture.png" class="custom-profile-image">
//           <div class="d-flex m-auto justify-content-center p-2">
//             <div>
//               <a href="github.com" title="GitHub.com" class="btn btn-primary m-2 custom-github-link">GitHub Repo</a>
//               <img class="custom-thumbnail custom-thumbnail-github" alt="GitHub profile picture">
//             </div>
//             <div>
//               <a href="Linkedin.com" title="LinkedIn Profile" class="btn btn-primary m-2 custom-linkedin-link">LinkedIn Profile</a>
//               <img class="custom-thumbnail custom-thumbnail-linkedin" alt="LinkedIn Profile Picture">
//             </div>
//           </div>
//           <p class="card-text card-text-custom"></p>
//           <p class="card-text me-2">Tags:</p>
//           <div class="d-flex align-items-center tags-cont">
//           </div>
//           <p class="card-text me-2">Purchase before:</p>
//           <div class="d-flex align-items-center">
//             <p class="ms-2 btn btn-primary">${endsAtFormatted}</p>
//           </div>
//         </div>
//         <div class="card-footer d-flex text-center justify-content-center align-items-center flex-column">
//           <span class="mt-2">See auction and make bids:</span>
//           <a href="single-listing.html?id=${id}" class="card-link custom-card-link">
//             <img src="/img/money-bag-xxl.png" class="card-img m-2" alt="money-bag-icon">
//           </a>
//         </div>`;

//       listing.querySelector(".title-cont").textContent = title;
//       listing.querySelector(".card-text-custom").textContent = description;

//       // Iterate through tags and create elements for each tag
//       const tagsCont = listing.querySelector(".tags-cont");
//       tags.forEach(tag => {
//         const singleTag = document.createElement("p");
//         singleTag.classList.add("ms-2", "btn", "btn-primary");
//         singleTag.textContent = tag;
//         tagsCont.appendChild(singleTag);
//       });

//       listing.querySelector(".custom-profile-image").setAttribute("src", listingPicture);
//       listing.querySelector(".custom-thumbnail-github").setAttribute("src", listingRepo);
//       listing.querySelector(".custom-thumbnail-linkedin").setAttribute("src", listingLinkedIn);
//       listing.querySelector(".custom-card-link").setAttribute("title", title);
//       listingsSection.appendChild(listing);
//     }
//   }
//   catch (error) {
//     console.log("error: ", error);
//     listingsSection.innerHTML = `<span class="m-auto text center error-message">${error}</span>`
//   }
// };

// listingsFeed();


{/* <div class="card text-center mx-auto my-2 card-custom">
  <div class="card-header d-flex justify-content-center flex-column">
    <span class="m-2">Senior frontend developer with 7 years of experience, mainly in React, Typescript and Cloud</span>
    <span class="last-updated-span">Last updated 6th of January 2024</span>
  </div>
  <div class="card-body d-flex flex-column m-auto align-items-center">
    <img src="img/blank-profile-picture.png" class="custom-profile-image">
    <div class="d-flex m-auto justify-content-center p-2">
      <div>
        <a href="github.com" title="GitHub.com" class="btn btn-primary m-2">GitHub Repo</a>
        <img src="/img/blank-profile-picture.png" class="custom-thumbnail" alt="GitHub profile picture">
      </div>
      <div>
        <a href="Linkedin.com" title="LinkedIn Profile" class="btn btn-primary m-2">LinkedIn Profile</a>
        <img src="/img/blank-profile-picture.png" class="custom-thumbnail" alt="LinkedIn Profile Picture">
      </div>
    </div>
    <p class="card-text card-text-custom">Has worked extensively with frontend microservices architecture for retail companies, and have acquired team lead responsibilities throughout his career. Currently looking for new and exciting challenges, primarily within the startup world. Looking to expand upon frontend knowledge, while transitioning more and more into fullstack with backend responsibilities as well.</p>
    <p href="" class="card-text me-2">Tags:</p>
    <div class="d-flex align-items-center">
      <p class="ms-2 btn btn-primary">Frontend</p>
      <p class="ms-2 btn btn-primary">Architecture</p>
    </div>
    <p href="" class="card-text me-2">Purchase before:</p>
    <div class="d-flex align-items-center">
      <p class="ms-2 btn btn-primary">31.12.2023</p>
    </div>
  </div>
  <div class="card-footer d-flex text-center justify-content-center align-items-center flex-column">
    <span class="mt-2">See auction and make bids:</span>
    <a href="single-listing.html" class="card-link">
      <img src="/img/money-bag-xxl.png" class="card-img m-2">
    </a>
  </div>
</div> */}