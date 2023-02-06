function appendCity() {

    let myCitySearch = document.getElementById("search-input").value;
    console.log(`'myCitySearch= `, myCitySearch);
    searchRecord = findData();
    let cityFind = $("<div>")
    cityFind.attr('id', myCitySearch)
    cityFind.text(myCitySearch)
    cityFind.addClass("h5")

    if (searchRecord.includes(myCitySearch) === false) {
        $(".history").append(cityFind)
    }
    $(".subheading").attr("style", "display:inline")
    cityLocalStorage(myCitySearch);

};

function findData() {
    let currentList = localStorage.getItem("city");
    if (currentList !== null) {
        newList = JSON.parse(currentList);
        return newList;
    } else {
        newList = [];
    }
    return newList;
}
// adding city to local storage
function cityLocalStorage(n) {
    let addedList = findData();

    if (searchRecord.includes(myCitySearch) === false) {
        addedList.push(n);
    }

    localStorage.setItem("city", JSON.stringify(addedList));

};

// Function for displaying cities
//display history search data
function displayData() {
    let searchRecord = findData();
    for (let i = 0; i < searchRecord.length; i++) {
        myCitySearch = searchRecord[i];
        let cityFind = $("<div>")
        cityFind.attr('id', myCitySearch)
        cityFind.text(myCitySearch)
        cityFind.addClass("h4")

        $(".history").append(cityFind)
    }
};

displayData();

let cityCode = myCitySearch;
let cityTitle = $("<h>")

function weatherNow() {
    myCitySearch = document.querySelector("#searchInput").value;

    $(".fiveDay").empty();
    $(".city").empty()

    cityTitle.addClass("h3")
    let temperature = $("<div>")
    let wind = $("<div>")
    let humidity = $("<div>")
    let icon = $("<img>")
    icon.addClass("icon");
    let dateTime = $("<div>")

    document.getElementByClassName("city").classList.add("list-cities")
    document.getElementByClassName("city").appendCity(cityTitle)
    document.getElementByClassName("city").append(dateTime)
    document.getElementByClassName("city").append(icon)
    document.getElementByClassName("city").append(temperature)
    document.getElementByClassName("city").append(wind)
    document.getElementByClassName("city").append(humidity)
}
let lat = 0;
let lon = 0;
function locationURL() {
    // get location from search
    // fetch weather data
    console.log("locationURL");
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=Leeds&limit=5&appid=bd4f86e586f7c181c1e585358d3c507c")
        .then(response => response.json())
        .then(citySearch => {
            console.log("myCitySearch = ", citySearch);
            let city = citySearch[0];
            console.log(city.lat);
            console.log(city.lon);
            appendCity();
            // adding to local storage
            addedCity(city);
            // changing src attributes in the DOM
            document.getElementById("weather-icon").setAttribute('src', urlIcon);
        })
};

// locationURL();
let liveWeatherLink = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=bd4f86e586f7c181c1e585358d3c507c
    `
fetch(liveWeatherLink)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let displayIcon = data.list[0].weather[0].icon;
        let imageSource = "https://openweathermap.org/img/wn/" + displayIcon + ".png";
        document.querySelector("#imageWeather").setAttribute('src', imageSource)
        cityTitle.text(cityCode);

        let date = new Date(data.current.dt * 1000);
        dateTime.text("(" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")");

        temperature.text("temperature: " + data.current.temperature + "fahreinheight");
        humidity.text("Humidity: " + data.current.humidity + " %");
        wind.text("Wind Speed: " + data.current.wind_speed + " mph");

        for (let i = 1; i < 6; i++) {
            // creating for loop to make weather cards as and when user searches a city
            let weatherCard = $("<div>")
            this["forecastDate" + i] = $("<h>")
            this["forecastIcon" + i] = $("<img>")
            this["forecastTemp" + i] = $("<div>")
            this["forecastWind" + i] = $("<div>")
            this["forecastHumidity" + i] = $("<div>")

            this["forecastDay" + i] = new Date(data.daily[i].dt * 1000);

            (this["forecastDate" + i]).text(((this["forecastDay" + i]).getMonth() + 1) + "/" + (this["forecastDay" + i]).getDate() + "/" + (this["forecastDay" + i]).getFullYear());
            (this["forecastTemp" + i]).text("Temperature: " + data.daily[i].temp.day + " F");
            (this["forecastWind" + i]).text("Wind: " + data.daily[i].wind_speed + " MPH");
            (this["forecastHumidity" + i]).text("Humidity: " + data.daily[i].humidity + " %");
            (this["weatherIcon" + i]) = data.daily[i].weather[0].icon;

            DateimageSource = "https://openweathermap.org/img/wn/" + (this["displayIcon" + i]) + ".png";
            (this["forecastIcon" + i]).attr('src', DateimageSource)

            $(".fiveDay").append(weatherCard)
            weatherCard.append((this["forecastDate" + i]));
            weatherCard.append((this["forecastIcon" + i]));
            weatherCard.append((this["forecastTemp" + i]));
            weatherCard.append((this["forecastWind" + i]));
            weatherCard.append((this["forecastHumidity" + i]));
            weatherCard.addClass("weatherCard")
        }
    }
    );

let forecast5 = (event) => {
    // fetch weather data
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=Leeds&limit=5&appid=bd4f86e586f7c181c1e585358d3c507c")
        .then(response => response.json())
        .then(citySearch => {
            let city = citySearch[0]
            console.log(city.lat);
            console.log(city.lon);

            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=bd4f86e586f7c181c1e585358d3c507c`)

        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // adding to local storage
            addedCity(city);
            // formula to get icon
            displayIcon = `https://openweathermap.org/img/w/${city.weather.icon}`;
        })
    forecast5(event);
};

//Event listeners for search button
// document.getElementById("search-button").addEventListener('click', appendCity);
document.getElementById("search-button").addEventListener('click', locationURL);

//Event listener for recent city search buttons
document.querySelector(".history").addEventListener("click", (event) => {
    event.preventDefault();
    $(".subtitle").attr("style", "display:inline")
    // document.getElementById("search-input").value = event.target.id;
    locationURL();
});


