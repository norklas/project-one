// API Keys
var campgroundApiKey = "Bmz374aWCDdIEBnTNdAjjyehjiMRkPJpJqGoY9qC";
var mapApiKey =
  "pk.eyJ1Ijoibm9ya2xhcyIsImEiOiJja29haGN6Y2wwMHk4MnhwM2o2Ymc2YzJnIn0.cIu1zrch0el1XJPqoY3zFw";

// Elements
var searchFormEl = $("#search-form");
var searchInput = $("#search-value");
var searchHistory = $("#search-history");
var modalEl = $("#popup-modal");
var modalCloseBtn = $("#close-btn");
var modalErrorText = $("#error-text");
var cardSection = $("#card-section");
var cardContainer = $("#card-container");
var campCards = $("#camp-cards");
var clearBtn = $("#clear-btn");
var modalBody = $("#modal-body");
var modalText = $("#modal-body-text");

// Global variables for map latitude and longitude
var campLong;
var campLat;

let stateArray = localStorage.getItem("state")
  ? JSON.parse(localStorage.getItem("state"))
  : [];
localStorage.setItem("state", JSON.stringify(stateArray));
var data = JSON.parse(localStorage.getItem("state"));

// Submit button handler
function formSubmitHandler(e) {
  e.preventDefault();

  // Grabbing value of search input and feeding it into the campgroundData function
  var stateCode = searchInput.val().trim();

  // Pushing search value to stateArray
  stateArray.push(searchInput.val().trim());
  // Setting local storage to "state", and stringifying the array that holds the state information
  localStorage.setItem("state", JSON.stringify(stateArray));
  // Calling list maker function with stateCode to make text the state abbreviation
  liMaker(stateCode);
  // Reset search input
  searchInput.value = "";

  // Checking if stateCode = true, then calling campgroundData function with stateCode parameter, and resetting search input, else show error modal
  if (stateCode) {
    campgroundData(stateCode);
    searchInput.val("");
  } else {
    $(modalText).text("Please enter correct state abbreviation!");
    $(modalEl).css("display", "block");
  }
}

// Function to fetch campground data
function campgroundData(stateCode) {
  fetch(
    `https://developer.nps.gov/api/v1/campgrounds?stateCode=${stateCode}&limit=6&api_key=${campgroundApiKey}`
  ).then(function (response) {
    if (response.ok) {
      return response.json().then(function (data) {
        // If response is okay, then call displayCampgroundInfo
        displayCampgroundInfo(data, stateCode);
      });
    } else if (stateCode === false) {
      $(modalText).text("Please enter correct state abbreviation!");
      $(modalEl).css("display", "block");
    }
  });
}

// Function to display campground information
function displayCampgroundInfo(campgrounds) {
  // Clear old content
  $(campCards).html("");

  // Loop over campgrounds
  for (var i = 0; i < campgrounds.data.length; i++) {
    // Get camp longitude and camp latitude for Mapbox API
    campLong = campgrounds.data[i].longitude;
    campLat = campgrounds.data[i].latitude;

    // Articles for camp cards
    var campInfo = $("<article>");
    campCards.append(campInfo);
    campInfo.addClass(
      "max-w-sm rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700 my-4 hover:opacity-90"
    );
    campInfo.attr("id", "card-info");

    // Creating image element, grabbing image url through data array, setting size, and appending it
    var imgDiv = $("<div>");
    var imgEl = $("<img>");
    imgEl.attr("src", campgrounds.data[i].images[0].url);
    imgEl.addClass("rounded-t-lg h-100 w-100 object-fill");

    campInfo.append(imgDiv);
    imgDiv.append(imgEl);

    // Creating title element, and appending it to camp info article within card container
    var infoDiv = $("<div>");
    campInfo.append(infoDiv);
    infoDiv.addClass("p-5");

    // Campground name
    var campgroundName = campgrounds.data[i].name;

    var titleEl = $("<h5>");
    titleEl.addClass(
      "mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
    );
    titleEl.append(campgroundName);
    infoDiv.append(titleEl);

    // Creating p elements for address
    var descriptionEl = $("<p>");
    descriptionEl.text("Description: " + campgrounds.data[i].description);
    descriptionEl.addClass("mb-3 font-normal text-gray-700 dark:text-gray-400");

    var campsitesEl = $("<p>");
    campsitesEl.addClass("font-semibold");
    campsitesEl.text(
      "Total sites: " + campgrounds.data[i].campsites.totalSites
    );

    //infoDiv.append(descriptionEl);
    infoDiv.append(campsitesEl);

    // Creating p element for cost
    var costEl = $("<p>");
    costEl.addClass("font-semibold");
    costEl.text("Cost: $" + campgrounds.data[i].fees[0].cost + " per night");

    infoDiv.append(costEl);

    // Creating anchor element for more info
    var linkEl = $("<a>");
    linkEl.attr("href", campgrounds.data[i].url);
    linkEl.attr("id", "card-btn");
    linkEl.addClass(
      "inline-flex items-center py-2 px-3 mt-4 text-sm font-medium text-center rounded-lg focus:ring-4 font-bold"
    );
    linkEl.text("Read more");

    infoDiv.append(linkEl);

    // Mapbox API to display map of location
    var mapEl = $("<a>");
    mapEl.attr(
      "href",
      `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s+555555(${campLong},${campLat})/${campLong},${campLat},7,0/400x400?access_token=${mapApiKey}`
    );
    mapEl.attr("id", "map-btn");
    mapEl.attr("target", "_blank");
    mapEl.addClass(
      "inline-flex items-center py-2 px-3 mt-4 ml-2 text-sm font-medium text-center rounded-lg focus:ring-4 font-bold"
    );
    mapEl.text("View Map");

    infoDiv.append(mapEl);
  }
}

// Function to load last page state
function loadLastState() {
  var sState = JSON.parse(localStorage.getItem("state"));
  if (sState !== null) {
    sState = JSON.parse(localStorage.getItem("state"));
    for (i = 0; i < sState.length; i++) {
      addToList(sState[i]);
    }
    stateCode = sState[i - 1];
    campgroundData(stateCode);
  }
}

// List maker function, which takes stateCode, creates unordered list, and list item then add classes/attributes, and append to search history article
function liMaker(stateCode) {
  var li = $("<li>");
  li.addClass("ml-2 mt-4 w-48 text-center rounded-lg");
  li.attr("id", "list-item");
  var ul = $("<ul>");
  ul.attr("id", "list-container");
  li.text(stateCode);
  // If statement to check if #list-container exists, if it does, do not append more unordered lists
  if ($("#list-container").length === 0) {
    searchHistory.append(ul);
  }
  $("#list-container").append(li);
}

// For each stateCode, call liMaker and create list from stateCode
data.forEach((stateCode) => {
  liMaker(stateCode);
});

// Clear button functionality, upon clicking, clear localStorage, empty unordered list, and reload page
clearBtn.on("click", function () {
  localStorage.clear();
  $("ul").empty();
  document.location.reload();
});

// Dynamically add the passed state on the search history
function addToList(s) {
  var listEl = $("<li>" + s.toUpperCase() + "</li>");
  $(listEl).attr("class", "list-group-item");
  $(listEl).attr("data-value", s.toUpperCase());
  $(".list-group").append(listEl);
}

// Display the past search again when the list group item is clicked in search history
$(searchHistory).on("click", "li", function () {
  stateCode = $(this).text();
  campgroundData(stateCode);
});

// Function to close modal
$(modalEl).on("click", "button", function () {
  $(modalEl).css("display", "none");
});

// On form submit, call formSubmitHandler
searchFormEl.on("submit", formSubmitHandler);

// Calling loadLastState function
loadLastState();
