// Logout code

const logoutButton = document.querySelector(".logout-button");

logoutButton.addEventListener("click", () => {
  localStorage.clear();
  location.href = "index.html";
});

// Display full individual listing

import { baseUrl } from "./constants/api.js";
import { options } from "./constants/headers.js";
import { token, profilePictureUrl, usernameConst } from "./constants/localStorage.js";

const queryString = document.location.search;
const queryParams = new URLSearchParams(queryString);
const listingId = queryParams.get("id");

const singleListingsUrl = `${baseUrl}/auction/listings/${listingId}?_bids=true&_seller=true`;
const listingCont = document.querySelector(".listing-cont");
const feedbackCont = document.querySelector(".feedback-cont");

/**
 * @function singleListingDisplay This function fetches the data of a single listing, based on the listingId that is passed in the URL. It then populates the HTML with the data from the API call, and dynamically creates elements for the tags and the bids, to display them on the page.  
 */

async function singleListingDisplay() {
  try {
    const response = await fetch(singleListingsUrl, options);
    console.log("Response: ", response);

    const json = await response.json();
    console.log("json: ", json);

    if(!response.ok) {
      throw new Error(json.errors[0].message);
    }
    
    // Prevent users from bidding on their own listings
    let seller = json.seller.name;
    if (seller === usernameConst) {
      const makeBidCont = document.querySelector(".card-custom-2");
      makeBidCont.classList.add("d-none");
    }

    // Display listing data

    let id = json.id;

    let title = json.title;
    let description = json.description;

    let listingPicture = json.media[0];
    if (listingPicture) {
      listingPicture = json.media[0];
    } else {
      listingPicture = "/img/blank-profile-picture.png";
    }

    let listingRepo = json.media[1];
    if (listingRepo) {
      listingRepo = json.media[1];
    } else {
      listingRepo = "/img/blank-profile-picture.png";
    }

    let listingLinkedIn = json.media[2];
    if (listingLinkedIn) {
      listingLinkedIn = json.media[2];
    } else {
      listingLinkedIn = "/img/blank-profile-picture.png";
    }

    let tags = json.tags;

    let updated = json.updated;
    let updatedFormatted = updated.slice(0, 10);

    let endsAt = json.endsAt;
    let endsAtFormatted = endsAt.slice(0, 10);

    let bids = json.bids;

    const listing = document.createElement("div");
    listing.classList.add("card", "text-center", "mx-auto", "mt-2", "card-custom");
    listing.innerHTML = `
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
        <p class="card-text me-2">Auction ends at:</p>
        <div class="d-flex align-items-center">
          <p class="ms-2 btn btn-primary">${endsAtFormatted}</p>
        </div>
      </div>
      <div class="card-footer d-flex text-center justify-content-center align-items-center flex-column">
        <div class="container text-center d-flex justify-content-middle flex-column bg-white p-3 my-5 current-bids-class">
        </div>
      </div>`;

    listing.querySelector(".title-cont").textContent = title;
    listing.querySelector(".card-text-custom").textContent = description;
    listing.querySelector(".custom-thumbnail").setAttribute("src", listingPicture);

    // Iterate through tags and create elements for each tag
    const tagsCont = listing.querySelector(".tags-cont");
    tags.forEach(tag => {
      const singleTag = document.createElement("p");
      singleTag.classList.add("ms-2", "btn", "btn-primary");
      singleTag.textContent = tag;
      tagsCont.appendChild(singleTag);
    });

    // Create bids cont section

    const bidsCont = listing.querySelector(".current-bids-class");
      const bidsContTitle = document.createElement("div");
      bidsContTitle.classList.add("row", "d-flex", "flex-column", "justify-content-center", "my-2");
      bidsCont.appendChild(bidsContTitle);

      const bidsContTitleH1 = document.createElement("h1");
      bidsContTitleH1.classList.add("mt-2");
      bidsContTitleH1.textContent = "Current bids:";
      bidsContTitle.appendChild(bidsContTitleH1);

    // Iterate through bids and make elements for each bid, append to bids cont section

    bids.forEach(bid => {
      const singleBidCont = document.createElement("div");
      singleBidCont.classList.add("row", "text-center", "d-flex", "justify-content-center");
        const singleBidName = document.createElement("h3");
        singleBidName.classList.add("col", "my-auto", "profile-name-class");
        singleBidName.textContent = bid.bidderName;
        singleBidCont.appendChild(singleBidName);
        const singleBidAmountCont = document.createElement("div");
        singleBidAmountCont.classList.add("col", "d-flex", "justify-content-center", "my-auto", "p-3", "bid-span");
        singleBidCont.appendChild(singleBidAmountCont);

        const singleBidAmount = document.createElement("h3");
        singleBidAmount.classList.add("p-2", "my-auto", "bid-cont");
        singleBidAmount.textContent = bid.amount;
        singleBidAmountCont.appendChild(singleBidAmount);

        const singleBidImage = document.createElement("img");
        singleBidImage.classList.add("card-img", "my-auto");
        singleBidImage.setAttribute("src", "/img/money-bag-xxl.png");
        singleBidImage.setAttribute("alt", "Money Bag Icon");
        singleBidAmountCont.appendChild(singleBidImage);

        const singleBidDate = document.createElement("h3");
        singleBidDate.classList.add("col", "my-auto", "bid-date-cont");
        singleBidDate.textContent = bid.created.slice(0, 10);
        singleBidCont.appendChild(singleBidDate);

      bidsCont.appendChild(singleBidCont);
    });

    listing.querySelector(".custom-profile-image").setAttribute("src", listingPicture);
    listing.querySelector(".custom-thumbnail-github").setAttribute("src", listingRepo);
    listing.querySelector(".custom-thumbnail-linkedin").setAttribute("src", listingLinkedIn);
    listingCont.prepend(listing);
  }
  catch (error) {
    console.log("error: ", error);
    feedbackCont.innerHTML = `<span class="m-auto text center error-message">${error}</span>`
  }
};

singleListingDisplay();

// Display correct profile picture on make new bids section

const profilePicImg = document.querySelector(".custom-thumbnail-make-bid");

if (profilePictureUrl) {
  profilePicImg.setAttribute("src", profilePictureUrl);
} else {
  profilePicImg.setAttribute("src", "/img/blank-profile-picture.png");
}

// Make new bids

const submitButton = document.querySelector(".submit-button-class");

/**
 * @function submitButton This function makes a POST request to the API, to make a new bid on the listing. It takes the input value from the bid input field, and sends it to the API, to make a new bid. If the bid is successful, it reloads the page to display the new bid. If the bid is unsuccessful, it displays an error message to the user, telling them what went wrong.
 * @param {string} bidInput The input value from the bid input field
 * @property {number} bidAmount The parsed float value of the bid input
 */

submitButton.addEventListener("click", async () => {
  const bidInput = document.querySelector(".bid-input").value;
  const bidAmount = parseFloat(bidInput);

  const bidOptions = {
    method: "POST",
    body: JSON.stringify({
      "amount": bidAmount,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  if (!listingId) {
    console.error("Invalid listingId");
    feedbackCont.innerHTML = `<span class="m-auto text center error-message">Invalid listing ID</span>`
    return;
  }
  const bidOnListingUrl = `${baseUrl}/auction/listings/${listingId}/bids`;

  try {
    const response = await fetch(bidOnListingUrl, bidOptions);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.errors[0].message);
    }
    location.reload();
  }
  catch (error) {
    console.log("error: ", error);
    feedbackCont.innerHTML = `<span class="m-auto text center error-message">${error}</span>`
  }
});