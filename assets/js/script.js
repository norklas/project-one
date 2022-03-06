// API Keys
var openWeatherApiKey = "bb50ceaa5c96b3d1b021c2c7a46d82b6";
var campgroundApiKey = "Bmz374aWCDdIEBnTNdAjjyehjiMRkPJpJqGoY9qC";

// Elements
var searchFormEl = document.getElementById("search-form");
var searchInput = document.getElementById("search-value");
var modalEl = document.getElementById("popup-modal");
var modalCloseBtn = document.getElementById("close-btn");

function formSubmitHandler(e) {
  e.preventDefault();

  var stateCode = searchInput.value.trim();

  if (stateCode) {
    campgroundData(stateCode);
    searchInput.value = "";
  } else {
    modalEl.style.display = "block";
  }
}

function campgroundData(stateCode) {
  fetch(
    `https://developer.nps.gov/api/v1/campgrounds?stateCode=${stateCode}&limit=4&api_key=${campgroundApiKey}`
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    }
  });
}

window.onclick = function (event) {
  if (event.target == modalCloseBtn) {
    modalEl.style.display = "none";
  }
};

searchFormEl.addEventListener("submit", formSubmitHandler);
