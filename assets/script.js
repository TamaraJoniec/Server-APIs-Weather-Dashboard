let dt = 0;
let cityFind = 0;
let newList;
let cityTitle = document.getElementById("city-title");
let icon = document.getElementById("weather-icon");
let temperature = document.getElementById("temperature");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
const listCities = document.querySelector(".list-cities");
const historyList = document.getElementById("history-list");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector(".search-results");


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
            const todayWeather = document.querySelector("#today-weather");
            const hero = document.getElementById("hero");
            hero.classList.add("hero-banner--show");
            todayWeather.innerHTML = "";

            const todayCityName = document.createElement("h2");
            todayCityName.textContent = data.name;
            todayWeather.appendChild(todayCityName);

            const todayDate = document.createElement("h3");
            todayDate.textContent = new Date().toLocaleDateString();
            todayWeather.appendChild(todayDate);

            const todayWeatherInfo = document.createElement("div");
            todayWeatherInfo.classList.add("today-weather-info");
            todayWeather.appendChild(todayWeatherInfo);

            const todayTemp = document.createElement("p");
            todayTemp.innerHTML = `Temperature: ${Math.round(
                data.main.temp
            )}&deg;C`;
            todayWeatherInfo.appendChild(todayTemp);

            const todayHumidity = document.createElement("p");
            todayHumidity.textContent = `Humidity: ${data.main.humidity}%`;
            todayWeatherInfo.appendChild(todayHumidity);

            const todayWind = document.createElement("p");
            todayWind.innerHTML = `Wind Speed: ${Math.round(
                data.wind.speed
            )} km/h`;
            todayWeatherInfo.appendChild(todayWind);

            const banner = document.getElementById("hero-banner");
            const bannerIcon = banner.querySelector(".icon");
            const bannerTemp = banner.querySelector(".banner-temp");
            const bannerHumidity = banner.querySelector(".banner-humidity");
            const bannerWind = banner.querySelector(".banner-wind");

            bannerIcon.setAttribute(
                "src",
                `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
            );
            banner.appendChild(bannerIcon);
            bannerTemp.textContent = `Temperature: ${Math.round(
                data.main.temp
            )}&deg;C`;
            bannerHumidity.textContent = `Humidity: ${data.main.humidity}%`;
            bannerWind.textContent = `Wind Speed: ${Math.round(
                data.wind.speed
            )} km/h`;

            banner.style.display = "block";

            todayCityName.style.fontSize = "5rem";
            todayCityName.style.fontWeight = "bold";
            todayDate.style.fontSize = "2rem";
            todayDate.style.fontWeight = "bold";
            todayWeatherInfo.style.fontSize = "2rem";
        })
        .catch((error) => {
            console.error(error);
            alert("There was an error fetching the weather data. Please try again.");
        });
}

// Five day weather forecast

function weatherInfo(city) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = ""; // clear old weather cards

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=bd4f86e586f7c181c1e585358d3c507c&units=imperial&cnt=40`)
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
                forecastTemp.textContent = `Temperature: ${data.list[i].main.temp} F`;
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

function addedCity(city) {
    const newList = findData();
    const cityFind = document.createElement("div");
    cityFind.setAttribute("id", city.name);
    cityFind.textContent = city.name;
    cityFind.classList.add("h5");

    if (!newList.includes(city.name)) {
        listCities.appendChild(cityFind);
    }

    document.querySelector(".subheading").setAttribute("style", "display:inline");

    function findData() {
        const currentList = localStorage.getItem("city");
        const newList = currentList !== null ? JSON.parse(currentList) : [];
        return newList;
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

// Function for displaying cities
function displayData() {
    const searchRecord = findData();
    const listCities = document.querySelector(".list-cities");
    let citiesHtml = "";

    for (let i = 0; i < searchRecord.length; i++) {
        citiesHtml += `<h4 id="${searchRecord[i].name}" class="h4">${searchRecord[i].name}</h4>`;
    }

    listCities.innerHTML = citiesHtml;

    const historyList = document.getElementById("history-list");
    const historyItem = document.createElement("button");
    historyItem.classList.add("history-item");
    historyItem.textContent = city.name;
    historyItem.addEventListener("click", function () {
        weatherInfo(city);
    });
    historyList.appendChild(historyItem);

};

// debounce the search input
let timeoutId;
searchInput.addEventListener("input", function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(locationURL, 500);
});


// Add the search term to the search history
function addToHistory(searchTerm) {
    // Get the existing search history
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    // Add the new search term to the search history
    searchHistory.push(searchTerm);

}
//Event listeners for search button
document.getElementById("search-button").addEventListener('click', locationURL);

// attach a click event listener to the parent element
searchResults.addEventListener("click", function (event) {
    // check if the click event was triggered by a search result
    if (event.target.classList.contains("search-result")) {
        // get the city object from the data attribute of the search result
        const city = JSON.parse(event.target.dataset.city);
        // update the weather information for the selected city
        weatherInfo(city);
        addedCity(city);
        weatherNow(city);
        // clear the search results
        searchResults.innerHTML = "";
    }
});