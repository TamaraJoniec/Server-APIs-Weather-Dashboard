const apiKey = "bd4f86e586f7c181c1e585358d3c507c";
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector('#search-form');
const searchResults = document.getElementById("search-history");
const searchHistoryList = document.getElementById("search-history-list");
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.querySelector('#clear-history');
const cityTitle = document.getElementById("city-title");
const icon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecastContainer = document.getElementById("forecast-container");
// Cache frequently accessed DOM elements
const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const listCities = document.querySelector("#list-cities");
const searchHistory = document.querySelector("#search-history");
// Cache search history items and add event listeners
const searchHistoryItems = searchHistoryList.getElementsByTagName('button');
Array.from(searchHistoryItems).forEach((item) => {
  item.addEventListener('click', () => {
    locationURL(item.textContent);
  });
});

// Add event listener to clear search history button
clearHistoryButton.addEventListener('click', () => {
  localStorage.clear();
  searchResults.innerHTML = '';
});

// Initialize the application
function init() {
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await locationURL(searchInput.value.toLowerCase());
    searchInput.value = '';
  });
}

async function locationURL(initialSearch) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${initialSearch}&limit=5&appid=${apiKey}`);
  const citySearch = await response.json();
  const city = citySearch[0];
  console.log(citySearch);

  await Promise.all([
    weatherInfo(city),
    addedCity(city),
    weatherNow(city)
  ]);
}

async function weatherNow(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${apiKey}`);
  const data = await response.json();
  const currentWeatherElement = document.getElementById("current-weather");
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  const backgroundImageURL = `url('https://source.unsplash.com/1600x900/?${data.weather[0].main}')`;

  currentWeatherElement.textContent = '';
  const weatherInfo = `
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
      backgroundImageURL = `url('https://source.unsplash.com/1600x900/?${data.weather[0].main}')`;
      background.style.backgroundImage = backgroundImageURL;
    };


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

        // Refactored code to create weather card elements
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

        // Refactored code to calculate temperature in Celsius
        const celsiusTemp = (data.list[i].main.temp - 32) * 5 / 9;
        forecastTemp.textContent = `Temperature: ${celsiusTemp.toFixed(1)} °C`;
        forecastWind.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        forecastHumidity.textContent = `Humidity: ${data.list[i].main.humidity} %`;
        forecastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`);

        // Refactored code to append weather card elements
        weatherCard.appendChild(forecastIcon);
        weatherCard.appendChild(forecastTemp);
        weatherCard.appendChild(forecastWind);
        weatherCard.appendChild(forecastHumidity);

        weatherCards.push(weatherCard);
      }

      // Refactored code to append weather cards to forecast container
      forecastContainer.append(...weatherCards);
    });
};

// Initialize the application
function init() {
  // Add an event listener to the form to prevent default form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    locationURL();
    input.value = "";
  });

  // Add event listener to search history container using event delegation
  searchHistory.addEventListener("click", (event) => {
    // Check if the click event was triggered by a search result
    if (event.target.classList.contains("search-history")) {
      // Get the city object from the data attribute of the search result
      const city = JSON.parse(event.target.dataset.city);
      // Update the weather information for the selected city
      weatherInfo(city);
      addedCity(city);
      weatherNow(city);
      // Clear the search history
      searchHistory.innerHTML = "";
    }
  });

  // Display saved cities in the search history
  displayData();
}

// Add a city to the search history
function addedCity(city) {
  const newList = findData();
  const cityName = city.name;
  const cityBtn = document.createElement("button");
  cityBtn.setAttribute("id", cityName);
  cityBtn.textContent = cityName;
  cityBtn.classList.add("h5");

  if (!newList.includes(cityName)) {
    listCities.appendChild(cityBtn);
    cityLocalStorage(cityName);
  }

  cityBtn.addEventListener("click", () => weatherInfo(cityName));
  displayData();
}

// Get the current list of saved cities from local storage
function findData() {
  const currentList = localStorage.getItem("city");
  return currentList ? JSON.parse(currentList) : [];
}

// Add city to local storage
function cityLocalStorage(city) {
  const addedList = findData();
  if (!addedList.includes(city)) {
    addedList.push(city);
  }
  localStorage.setItem("city", JSON.stringify(addedList));
}

// Display the search history in the UI
function displayData() {
  const searchRecord = findData();
  let citiesHtml = "";
  if (searchRecord.length > 0) {
    citiesHtml = searchRecord.map((city) => `<button id="${city}" class="city-button">${city}</button>`).join("");
  }
  listCities.innerHTML = citiesHtml;
  document.querySelector(".subheading").style.display = searchRecord.length > 0 ? "inline" : "none";
}

// Handle city button click
function cityButtonClickHandler() {
  const city = this.id;
  weatherInfo(city);
}

// Debounce search input
let timeoutId;
input.addEventListener("input", () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(locationURL, 500);
});

// Event listeners for search button
document.getElementById("search-button").addEventListener("click", locationURL);

document.addEventListener("DOMContentLoaded", () => {
  const searchHistoryList = document.getElementById("search-history-list");
  searchHistoryList.innerHTML = "";

  searchHistory.forEach((city) => {
    const button = document.createElement("button");
    button.classList.add("search-history");
    button.dataset.city = JSON.stringify(city);
    button.textContent = city.name;
    searchHistoryList.appendChild(button);
  });
});

// Call init function when the page loads
init();


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


