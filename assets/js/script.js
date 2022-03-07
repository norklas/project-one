// API Keys
var openWeatherApiKey = "bb50ceaa5c96b3d1b021c2c7a46d82b6";
var campgroundApiKey = "Bmz374aWCDdIEBnTNdAjjyehjiMRkPJpJqGoY9qC";

// Elements
var searchFormEl = document.getElementById("search-form");
var searchInput = document.getElementById("search-value");
var modalEl = document.getElementById("popup-modal");
var modalCloseBtn = document.getElementById("close-btn");
var modalErrorText = document.getElementById("error-text");
var cardContainer = document.getElementById("card-container");
var campInfo = document.getElementById("camp-info");

// Submit button handler
function formSubmitHandler(e) {
  e.preventDefault();

  // Grabbing value of search input and feeding it into the campgroundData function
  var stateCode = searchInput.value.trim();

  if (stateCode) {
    campgroundData(stateCode);
    searchInput.value = "";
  } else {
    modalErrorText.textContent = "Please enter correct state abbreviation!";
    modalEl.style.display = "block";
  }
}

function allData(stateCode) {
  var campgrounds, weather;

  fetch(
    `https://developer.nps.gov/api/v1/campgrounds?stateCode=${stateCode}&limit=4&api_key=${campgroundApiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      campgrounds = data;

      for (var i = 0; i < campgrounds.data.length; i++) {
        var campLong = campgrounds.data[i].longitude;
        var campLat = campgrounds.data[i].latitude;

        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${campLat}&lon=${campLong}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${openWeatherApiKey}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);

            weather = data;
          });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Function to fetch campground data
// function campgroundData(stateCode) {
//   fetch(
//     `https://developer.nps.gov/api/v1/campgrounds?stateCode=${stateCode}&limit=4&api_key=${campgroundApiKey}`
//   ).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         console.log(data);
//         displayCampgroundInfo(data, stateCode);
//       });
//     } else {
//       modalErrorText.textContent = "No campground data found";
//       modalEl.style.display = "block";
//     }
//   });
// }

// function displayCampgroundInfo(campgrounds) {
//   console.log(campgrounds);
//   if (campgrounds.data.length === 0) {
//     modalErrorText.textContent = "No campgrounds found";
//     modalEl.style.display = "block";
//     return;
//   }

//   // Clear old content
//   campInfo.innerHTML = "";

//   // Loop over campgrounds
//   for (var i = 0; i < campgrounds.data.length; i++) {
//     // Campground name
//     var campgroundName = campgrounds.data[i].name;

//     // Creating title element, and appending it to camp info article within card container
//     var titleEl = document.createElement("span");
//     titleEl.textContent = campgroundName;

//     campInfo.appendChild(titleEl);

//     // Creating image element, grabbing image url through data array, setting size, and appending it
//     var imgEl = document.createElement("img");
//     imgEl.setAttribute("src", campgrounds.data[i].images[0].url);
//     imgEl.setAttribute("class", "object-cover h-60 w-60");

//     campInfo.appendChild(imgEl);

//     // Creating p elements for address
//     var cityEl = document.createElement("p");
//     cityEl.textContent = "City: " + campgrounds.data[i].addresses[0].city;

//     var lineOneEl = document.createElement("p");
//     lineOneEl.textContent =
//       "Address: " + campgrounds.data[i].addresses[0].line1;

//     var postalEl = document.createElement("p");
//     postalEl.textContent =
//       "Zip Code: " + campgrounds.data[i].addresses[0].postalCode;

//     var stateCodeEl = document.createElement("p");
//     stateCodeEl.textContent =
//       "State: " + campgrounds.data[i].addresses[0].stateCode;

//     campInfo.appendChild(cityEl);
//     campInfo.appendChild(lineOneEl);
//     campInfo.appendChild(postalEl);
//     campInfo.appendChild(stateCodeEl);

//     // Creating p element for cost
//     var costEl = document.createElement("p");
//     costEl.textContent =
//       "Cost: $" + campgrounds.data[i].fees[0].cost + " per night";

//     campInfo.appendChild(costEl);

//     // Creating anchor element for more info
//     var linkEl = document.createElement("a");
//     linkEl.setAttribute("href", campgrounds.data[i].url);
//     linkEl.innerText = "View more info";

//     campInfo.appendChild(linkEl);
//   }
// }

// Function to close modal
window.onclick = function (event) {
  if (event.target == modalCloseBtn) {
    modalEl.style.display = "none";
  }
};

searchFormEl.addEventListener("submit", formSubmitHandler);
