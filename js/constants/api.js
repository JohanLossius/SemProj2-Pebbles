import { usernameConst, token, profilePictureUrl } from "../constants/localStorage.js";

const baseUrl = "https://api.noroff.dev/api/v1";

const profileEndpoint = `/auction/profiles/${usernameConst}`;
const profileUrlEndpoint = `/auction/profiles/${usernameConst}/media`
const profileUrl = baseUrl + profileEndpoint;
const profilePicUpdateUrl = baseUrl + profileUrlEndpoint;
const profileListingsEndpoint = `/auction/profiles/${usernameConst}/listings`
const createListingEndpoint = `/auction/listings`;
const createListingUrl = baseUrl + createListingEndpoint;

const allProfileListingsUrl = `${baseUrl}${profileListingsEndpoint}?_active=true`;

const allListingsEndpoint = `/auction/listings`;
const allListingsUrl = baseUrl + allListingsEndpoint;
const limit = 1000;
const offset = 0;
const sort = "endsAt";
const sortOrder = "asc";

const allListingsUrlSorted = baseUrl + allListingsEndpoint + `?_sort=${sort}&_sortOrder=${sortOrder}`;

export { baseUrl, profileUrl, profilePicUpdateUrl, allProfileListingsUrl, createListingUrl, allListingsUrl, allListingsUrlSorted };