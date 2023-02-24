let lat = 0;
let lon = 0;
let dt = 0;
let temp;
let name;
let displayIcon;
let cityFind = 0;
let imageSource;
let newList;
let currentList;
let date = moment().format("ddd D MMM YYYY");
document.getElementById("liveWeather").textContent = date;
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
}

function weatherInfo(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=bd4f86e586f7c181c1e585358d3c507c&units=40"&cnt=40`)
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

        const forecastContainer = document.getElementById("forecast-container");
        forecastContainer.appendChild(weatherCard);
      }
    });
}

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
    currentList = localStorage.getItem("city");
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
  }
  
  function weatherNow(city) {
    let forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = "";
    let cityElement = document.querySelector(".city");
    cityElement.innerHTML = "";
    let cityTitle = document.createElement("h3");
    temperature = document.createElement("div");
    wind = document.createElement("div");
    humidity = document.createElement("div");
    let icon = document.createElement("img");
    icon.classList.add("icon");
    let dateTime = document.createElement("div");
  
    cityElement.classList.add("list-cities");
    cityElement.append(cityTitle);
    cityElement.append(dateTime);
  
    let weatherCard = document.createElement("div");
    let forecastIcon = document.createElement("div");
    forecastIcon.classList.add("forecast-icon");
    let forecastTemp = document.createElement("div");
    forecastTemp.classList.add("forecast-temp");
    let forecastWind = document.createElement("div");
    forecastWind.classList.add("forecast-wind");
    let forecastHumidity = document.createElement("div");
    forecastHumidity.classList.add("forecast-humidity");
  
    weatherCard.appendChild(forecastIcon);
    weatherCard.appendChild(forecastTemp);
    weatherCard.appendChild(forecastWind);
    weatherCard.appendChild(forecastHumidity);
  }
  //Event listeners for search button
  // document.getElementById("search-button").addEventListener('click', appendCity);
  document.getElementById("search-button").addEventListener('click', locationURL);
  
  //Event listener for recent city search buttons
  document.querySelector(".history").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(".subheading").style.display = "inline";
    locationURL();
  });
  