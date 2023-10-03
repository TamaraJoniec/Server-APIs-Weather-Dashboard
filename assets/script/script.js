
const cityTitle = document.getElementById("city-title");
const icon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const listCities = document.querySelector(".list-cities");
const historyList = document.getElementById("history-list");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector(".search-results");
const searchHistoryItem = document.getElementById('search-history-list');
const apiKey = "bd4f86e586f7c181c1e585358d3c507c";

let currentSearch = "";

// Hide the loading message and spinner once the content has finished loading
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
  });
  
// Changed the fetch request to use async/await syntax to improve readability and simplify the code.
async function locationURL() {
    const search = document.querySelector("#search-input").value;
    if (search === currentSearch) {
        return;
    }
    currentSearch = search;
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${search.toLowerCase()}&limit=5&appid=${apiKey}`);
        const citySearch = await response.json();
        const city = citySearch[0];
        weatherInfo(city);
        addedCity(city);
        await weatherNow(city);
    } catch (error) {
        console.log('error', error);
    }
}
// Removed the innerHTML assignment and replaced it with the createDocumentFragment() method to improve performance when adding weather cards to the forecast container.
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
            <p>Temperature: ${data.main.temp.toFixed(0)} &#8451;</p>
            <p>Feels Like: ${data.main.feels_like.toFixed(0)} &#8451;</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed.toFixed(0)} MPH</p>
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

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date();
            const fragment = document.createDocumentFragment(); // create a document fragment
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
                forecastTemp.textContent = `Temperature: ${celsiusTemp.toFixed(0)} °C`;
                forecastWind.textContent = `Wind: ${data.list[i].wind.speed.toFixed(0)} MPH`;
                forecastHumidity.textContent = `Humidity: ${data.list[i].main.humidity} %`;

                weatherCard.appendChild(forecastIcon);
                weatherCard.appendChild(forecastTemp);
                weatherCard.appendChild(forecastWind);
                weatherCard.appendChild(forecastHumidity);

                fragment.appendChild(weatherCard); // append each weather card to the fragment
            }

            forecastContainer.appendChild(fragment); // append the fragment to the forecast container
        });
}


function init() {
    const form = document.querySelector('#search-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.querySelector('#search-input');
        const query = input.value;
        weatherInfo(query);
        input.value = '';
    });
}
// Adds the city to the search list, and makes them into buttons.
function addedCity(city) {
    const history = findData();
    const historyList = document.createElement("button");

    if (!history.includes(city.name)) {
        history.push(city.name);
        localStorage.setItem("city", JSON.stringify(history));
    }

    historyList.textContent = city.name;
    historyList.classList.add("city-button");
    historyList.onclick = function () {
        weatherNow(city);
        weatherInfo(city);
    };

    listCities.appendChild(historyList);

    function findData() {
        const currentList = localStorage.getItem("city");
        const history = currentList !== null ? JSON.parse(currentList) : [];
        return history;
    }
};

// adding city to local storage
function cityLocalStorage(city) {
    const addedList = findData();

    if (!addedList.includes(city)) {
        addedList.push(city);
    }

    localStorage.setItem("city", JSON.stringify(addedList));
}

// Add the search term to the search history
function addToHistory(city) {
    // Get the existing search history
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    // Add the new search term to the search history
    searchHistory.push(city);
}
//Event listeners for search button
document.getElementById("search-button").addEventListener('click', locationURL);

// attach a click event listener to the parent element
searchHistoryItem.addEventListener("click", function (event) {
    // check if the click event was triggered by a search result
    if (event.target.classList.contains("search-history-list")) {
        // get the city object from the data attribute of the search result
        const city = JSON.parse(event.target.dataset.city);
        // update the weather information for the selected city
        weatherInfo(city);
        addedCity(city);
        weatherNow(city);
        // clear the search results
        searchHistoryItem.innerHTML = "";
    }
});


