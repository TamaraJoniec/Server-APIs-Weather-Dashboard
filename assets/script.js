
let lat = 0;
let lon = 0;
let dt = 0;
let temp;
let name;
let displayIcon;
let cityFind = 0;
let imageSource;
let newList;
let cityTitle = document.getElementById("city-title");
let icon = document.getElementById("weather-icon");
let temperature = document.getElementById("temperature");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let myCitySearch = document.querySelector("#search-input").value;

function locationURL() {
    let initialSearch = document.querySelector("#search-input").value;
    console.log(initialSearch);
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${initialSearch.toLowerCase()}&limit=5&appid=bd4f86e586f7c181c1e585358d3c507c`)
        .then(function (response) {
            return response.json();
        })
        .then(function (citySearch) {
            let city = citySearch[0];
            console.log(citySearch);
            weatherInfo(city);
            addedCity(city);
            weatherNow(city);
        });
};
// hero banner with today's weather displayed.
function weatherNow(city) {
    // API endpoint for current weather data
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(currentWeatherURL)
        .then((response) => response.json())
        .then((data) => {
            // Code to display today's weather
            const todayWeather = document.querySelector("#today-weather");

            // Clearing existing content
            todayWeather.innerHTML = "";

            // Creating and append elements
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

            // get today's weather data
            const todayWeatherData = data.weather[0];

            // get the HTML elements of the hero banner
            const banner = document.getElementById('hero-banner');
            const bannerIcon = banner.querySelector('.banner-icon');
            const bannerTemp = banner.querySelector('.banner-temp');
            const bannerHumidity = banner.querySelector('.banner-humidity');
            const bannerWind = banner.querySelector('.banner-wind');
            const bannerUVIndex = banner.querySelector('.banner-uvindex');

            // update the HTML of the hero banner with today's weather data
            bannerIcon.setAttribute(
                "src",
                `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
            );
            bannerTemp.textContent = `Temperature: ${Math.round(data.main.temp)}&deg;C`;
            bannerHumidity.textContent = `Humidity: ${data.main.humidity}%`;
            bannerWind.textContent = `Wind Speed: ${Math.round(data.wind.speed)} km/h`;
            bannerUVIndex.textContent = "UV Index: Not Available";

            // make the hero banner visible
            banner.style.display = 'block';

            // Setting the font size and weight of today's weather to be bigger and bolder
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
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const currentDate = new Date();

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

                forecastContainer.appendChild(weatherCard);

            };
            const heroBanner = document.getElementById("hero-banner");
            heroBanner.style.backgroundImage = `url("https://source.unsplash.com/1600x900/?${city.name}")`;
            heroBanner.style.display = "block";

        });
};

function addedCity(city) {
    newList = findData();
    cityFind = document.createElement("div");
    cityFind.setAttribute("id", city.name);
    cityFind.textContent = city.name;
    cityFind.classList.add("h5");

    if (newList.includes(city.name) === false) {
        document.querySelector(".list-cities").appendChild(cityFind);
    }

    document.querySelector(".subheading").setAttribute("style", "display:inline");
    city

    function findData() {
        let currentList = localStorage.getItem("city");
        if (currentList !== null) {
            newList = JSON.parse(currentList);
        } else {
            newList = [];
        }
        return newList;
    }
};

// adding city to local storage
function cityLocalStorage(city) {
    let addedList = findData();

    if (!addedList.includes(city)) {
        addedList.push(city);
    }
    localStorage.setItem("city", JSON.stringify(addedList));
};

// Function for displaying cities
function displayData() {
    let searchRecord = findData();
    let listCities = document.querySelector(".list-cities");

    for (let i = 0; i < searchRecord.length; i++) {
        let myCitySearch = document.createElement("h4");
        myCitySearch.setAttribute("id", searchRecord[i].name);
        myCitySearch.textContent = searchRecord[i].name;
        myCitySearch.classList.add("h4");
        listCities.append(myCitySearch);
    }

    const historyList = document.getElementById("history-list");
    const historyItem = document.createElement("button");
    historyItem.classList.add("history-item");
    historyItem.textContent = city.name;
    historyItem.addEventListener("click", function () {
        weatherInfo(city);
    });
    historyList.appendChild(historyItem);


};


//Event listeners for search button
// document.getElementById("search-button").addEventListener('click', appendCity);
document.getElementById("search-button").addEventListener('click', locationURL);

//Event listener for recent city search buttons
document.querySelector(".history").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(".subheading").style.display = "inline";
    locationURL();
});
