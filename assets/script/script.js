let dt = 0;
let cityFind = 0;
let newList;
let cityTitle = document.getElementById("city-title");
let icon = document.getElementById("weather-icon");
let temperature = document.getElementById("temperature");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
const historyList = document.getElementById("history-list");
const searchInput = document.querySelector("#search-input");
const searchResults = document.getElementById("search-history");
let listCities = document.querySelector(".list-cities");
let clearHistoryButton = document.querySelector('#clear-history');


function locationURL() {
  let initialSearch = document.querySelector("#search-input").value;
  console.log(initialSearch);
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${initialSearch.toLowerCase()}&limit=5&appid=bd4f86e586f7c181c1e585358d3c507c`)
    .then(response => response.json())
    .then(citySearch => {
      let city = citySearch[0];
      console.log(citySearch);
      weatherInfo(city);
      addedCity(city);
      weatherNow(city);
    });
}

function weatherNow(city) {
  const apiKey = "bd4f86e586f7c181c1e585358d3c507c";
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${apiKey}`;

  fetch(currentWeatherURL)
    .then(response => response.json())
    .then(data => {
      const currentWeatherElement = document.getElementById("current-weather");
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const iconCode = data.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

      currentWeatherElement.innerHTML = `
          <div>
            <h2>Current Weather in ${city.name}</h2>
            <p>${data.weather[0].description}</p>
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <p>Temperature: ${data.main.temp} &#8451;</p>
            <p>Feels Like: ${data.main.feels_like} &#8451;</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} MPH</p>
            <p>${new Date(data.dt * 1000).toLocaleDateString('en-GB', options)}</p>
          </div>
        `;

      // Set the background image based on the current weather
      const background = document.querySelector("body");
      const backgroundImageURL = `url('https://source.unsplash.com/1600x900/?${data.weather[0].main}')`;
      background.style.backgroundImage = backgroundImageURL;
    });
}


// Five day weather forecast

function weatherInfo(city) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = ""; // clear old weather cards

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=bd4f86e586f7c181c1e585358d3c507c&units=imperial&cnt=5`)
    .then(response => response.json())
    .then(data => {
      const currentDate = new Date();
      const weatherCards = [];

      for (let i = 0; i < 5; i++) {
        const forecastDate = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
        const weatherCard = document.createElement("div");
        weatherCard.classList.add("forecast-card");

        const dayOfWeek = forecastDate.toLocaleDateString("en-US", { weekday: "long" });
        const dayOfWeekElement = document.createElement("div");
        dayOfWeekElement.classList.add("day-of-week");
        dayOfWeekElement.innerText = dayOfWeek;
        weatherCard.appendChild(dayOfWeekElement);

        const forecastIcon = document.createElement("img");
        const forecastTemp = document.createElement("div");
        const forecastWind = document.createElement("div");
        const forecastHumidity = document.createElement("div");

        forecastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`);
        const celsiusTemp = (data.list[i].main.temp - 32) * 5 / 9; // convert temperature to Celsius
        forecastTemp.textContent = `Temperature: ${celsiusTemp.toFixed(1)} °C`;
        forecastWind.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        forecastHumidity.textContent = `Humidity: ${data.list[i].main.humidity} %`;

        weatherCard.appendChild(forecastIcon);
        weatherCard.appendChild(forecastTemp);
        weatherCard.appendChild(forecastWind);
        weatherCard.appendChild(forecastHumidity);

        weatherCards.push(weatherCard);
      }

      forecastContainer.append(...weatherCards);
    });
};
// Initializes the application by adding event listeners and setting up the initial state of the application.
function init() {
  const form = document.querySelector('#search-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    locationURL();
    const input = document.querySelector('#search-input');
    input.value = '';
  });

  // get the search history list and list items
  const searchHistoryItems = searchHistoryList.getElementsByTagName('button');

  // add a click event listener to each search history item
  for (let i = 0; i < searchHistoryItems.length; i++) {
    searchHistoryItems[i].addEventListener('click', (event) => {
      const query = event.target.textContent;
      locationURL();
      const input = document.querySelector('#search-input');
      input.value = query;
    });
  }

  // Display saved cities in the search history
  displayData();
}

function addedCity(city) {
  const newList = findData();
  const cityName = city.name;
  const cityBtn = document.createElement("button"); // create a button element
  cityBtn.setAttribute("id", cityName);
  cityBtn.textContent = cityName;
  cityBtn.classList.add("h5");

  if (!newList.includes(cityName)) {
    listCities.appendChild(cityBtn);
    cityLocalStorage(cityName); // calling cityLocalStorage
  }

  // add a click event listener to the button
  cityBtn.addEventListener("click", function () {
    weatherInfo(cityName); // reload the page with the corresponding city's weather forecast
  });

  // Display saved cities in the search history
  displayData();
};


// Get the current list of saved cities from local storage
function findData() {
  const currentList = localStorage.getItem("city");
  const newList = currentList !== null ? JSON.parse(currentList) : [];
  return newList;
};

// Add city to local storage
function cityLocalStorage(city) {
  const addedList = findData();

  if (!addedList.includes(city)) {
    addedList.push(city);
  }
  localStorage.setItem("city", JSON.stringify(addedList));
};

// Function for displaying cities in the search history
function displayData() {
  const searchRecord = findData();
  let citiesHtml = "";

  if (searchRecord.length > 0) {
    for (let i = 0; i < searchRecord.length; i++) {
      citiesHtml += `<button id="${searchRecord[i]}" class="city-button">${searchRecord[i]}</button>`;
    }
  }

  listCities.innerHTML = citiesHtml;

  // remove existing event listeners from city buttons
  const cityButtons = document.querySelectorAll(".city-button");
  for (let i = 0; i < cityButtons.length; i++) {
    cityButtons[i].removeEventListener("click", cityButtonClickHandler);
  }

  // add a click event listener to each button
  for (let i = 0; i < cityButtons.length; i++) {
    cityButtons[i].addEventListener("click", cityButtonClickHandler);
  }
  document.querySelector(".subheading").setAttribute("style", "display:inline");
};

function cityButtonClickHandler() {
  const city = this.id;
  weatherInfo(city); // reload the page with the corresponding city's weather forecast
}


// debounce the search input
let timeoutId;
searchInput.addEventListener("input", function () {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(locationURL, 500);
});

// Add the search term to the search history
function addToHistory(searchTerm) {
  // Get the existing search history or initialize it to an empty array if it doesn't exist
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Add the new search term to the search history
  searchHistory.push(searchTerm);

  // Save the updated search history in local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}



//Event listeners for search button
document.getElementById("search-button").addEventListener('click', locationURL);

// get the search history element
const searchHistory = document.getElementById("search-history-list");

// attach a click event listener to the search history element
searchHistory.addEventListener("click", function (event) {
  // check if the click event was triggered by a search result
  if (event.target.classList.contains("search-history")) {
    // get the city object from the data attribute of the search result
    const city = JSON.parse(event.target.dataset.city);
    // update the weather information for the selected city
    weatherInfo(city);
    addedCity(city);
    weatherNow(city);
    // clear the search history
    searchHistory.innerHTML = "";
  }
});


// an event listener to the new button so that it clears the search history when clicked
clearHistoryButton.addEventListener('click', () => {
  localStorage.removeItem('searchHistory');
  historyList.innerHTML = '';
  clearHistoryButton.style.display = 'none';
});

