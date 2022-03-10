// API Key
var campgroundApiKey = "Bmz374aWCDdIEBnTNdAjjyehjiMRkPJpJqGoY9qC";

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
var ul = $("<ul>");
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

  stateArray.push(searchInput.val().trim());
  localStorage.setItem("state", JSON.stringify(stateArray));
  liMaker(stateCode);
  searchInput.value = "";

  if (stateCode) {
    campgroundData(stateCode);
    searchInput.val("");
  } else {
    $(modalErrorText).text("Please enter correct state abbreviation!");
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
        // console.log(data);
        displayCampgroundInfo(data, stateCode);
      });
    } else {
      $(modalErrorText).text("No campground data found");
      $(modalEl).css("display", "block");
    }
  });
}

// Function to display campground information
function displayCampgroundInfo(campgrounds) {
  console.log(campgrounds);

  // Clear old content
  $(campCards).html("");

  // Loop over campgrounds
  for (var i = 0; i < campgrounds.data.length; i++) {
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
  }
}

// render function
function loadlastState() {
  $("<ul>").empty();
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

const liMaker = (stateCode) => {
  const li = $("<li>");
  li.addClass("ml-2 mt-4 w-48 text-center rounded-lg");
  li.attr("id", "list-item");
  const ul = $("<ul>");
  li.text(stateCode);
  ul.append(li);
  searchHistory.append(ul);
};

data.forEach((stateCode) => {
  liMaker(stateCode);
});

clearBtn.on("click", function () {
  localStorage.clear();
  $("ul").empty();
  //itemsArray = [];
  document.location.reload();
});

//Dynamically add the passed state on the search history
function addToList(s) {
  var listEl = $("<li>" + s.toUpperCase() + "</li>");
  $(listEl).attr("class", "list-group-item");
  $(listEl).attr("data-value", s.toUpperCase());
  $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
$(searchHistory).on("click", "li", function () {
  stateCode = $(this).text();
  campgroundData(stateCode);
});

//Clear the search history from the page
function clearHistory(event) {
  event.preventDefault();
  sState = [];
  localStorage.removeItem("state");
  document.location.reload();
}

// Function to close modal
$(modalEl).on("click", "button", function () {
  $(modalEl).css("display", "none");
});

searchFormEl.on("submit", formSubmitHandler);
loadlastState();
