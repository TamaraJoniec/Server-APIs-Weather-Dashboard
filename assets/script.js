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
$("#liveWeather").text(date);
let cityTitle = $("#city-title");
let icon = $("#weather-icon");
let temperature = $("#temperature");
let humidity = $("#humidity");
let wind = $("#wind");
let myCitySearch = document.querySelector("#search-input").value;

function locationURL() {
    // get location from search
    let initialSearch = document.querySelector("#search-input").value;

    console.log(initialSearch)
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${initialSearch.toLowerCase()}&limit=5&appid=bd4f86e586f7c181c1e585358d3c507c
    `)
        .then(response => response.json())
        .then(citySearch => {
            let city = citySearch[0];
            console.log(citySearch)

            weatherInfo(city);
            addedCity(city);
            // changing src attributes in the DOM
            weatherNow(city)
        })
}
function weatherInfo(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=bd4f86e586f7c181c1e585358d3c507c
        `)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayIcon = data.list[0].weather[0].icon;
            imageSource = "https://openweathermap.org/img/wn/" + displayIcon + ".png";
            icon.attr('src', imageSource)
            cityTitle.text(city.name);
            temperature.text("Temperature: " + data.list[0].main.temp + "fahreinheight");
            humidity.text("Humidity: " + data.list[0].main.humidity + " %");
            wind.text("Wind Speed: " + data.list[0].wind.speed + " mph");

            for (let i = 1; i < 6; i++) {
                // creating for loop to make weather cards as and when user searches a city
                let weatherCard = $("<div>")
                this["forecastDate" + i] = $("<h4>")
                this["forecastIcon" + i] = $("<img>")
                this["forecastTemp" + i] = $("<div>")
                this["forecastWind" + i] = $("<div>")
                this["forecastHumidity" + i] = $("<div>")

                this["forecastDay" + i] = new Date(data.list[i].dt * 1000);
                (this["forecastDate" + i]).text(this["forecastDay" + i]);

                // (this["forecastDate" + i]).text(((this["forecastDay" + i]).getMonth() + 1) + "/" + (this["forecastDay" + i]).getDate() + "/" + (this["forecastDay" + i]).getFullYear());
                (this["forecastTemp" + i]).text("Temperature: " + data.list[i].main.temp + " F");
                (this["forecastWind" + i]).text("Wind: " + data.list[i].wind.speed + " MPH");
                (this["forecastHumidity" + i]).text("Humidity: " + data.list[i].main.humidity + " %");
                (this["weatherIcon" + i]) = data.list[i].weather[0].icon;
                console.log(data);
                console.log(window.forecastIcon1)
                let DateimageSource = "https://openweathermap.org/img/wn/" + (this["weatherIcon" + i]) + ".png";
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
}

function addedCity(city) {
    newList = findData();
    cityFind = $("<div>")
    cityFind.attr('id', city.name)
    cityFind.text(city.name)
    cityFind.addClass("h5")

    if (newList.includes(city.name) === false) {
        $(".list-cities").append(cityFind)
    }
    $(".subheading").attr("style", "display:inline")
    cityLocalStorage(city);
};

function findData() {
    currentList = localStorage.getItem("city");
    if (currentList !== null) {
        newList = JSON.parse(currentList);

    } else {
        newList = [];
    }
    return newList;
}
// adding city to local storage
function cityLocalStorage(city) {
    let addedList = findData();

    if (addedList.includes(city) === false) {
        addedList.push(city);
    }
    localStorage.setItem("city", JSON.stringify(addedList));
};

// Function for displaying cities
//display history search data
function displayData() {
    let searchRecord = findData();

    for (let i = 0; i < searchRecord.length; i++) {
        myCitySearch = searchRecord[i]
        myCitySearch.attr('id', city.name)
        myCitySearch.text(city.name)
        myCitySearch.addClass("h4")
        $(".list-cities").append(cityFind)
    }
    displayData(cityFind);
};

function weatherNow(city) {
    $(".fiveDay").empty();
    $(".city").empty()
    cityTitle = $("<h3>")
    temperature = $("<div>")
    wind = $("<div>")
    humidity = $("<div>")
    icon = $("<img>")
    icon.addClass("icon")
    dateTime = $("<div>")

    $(".city").addClass("list-cities")
    $(".city").append(cityTitle)
    $(".city").append(dateTime)
    $(".city").append(icon)
    $(".city").append(temperature)
    $(".city").append(wind)
    $(".city").append(humidity)
}

//Event listeners for search button
// document.getElementById("search-button").addEventListener('click', appendCity);
document.getElementById("search-button").addEventListener('click', locationURL);

//Event listener for recent city search buttons
document.querySelector(".history").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(".subheading").setAttribute("style", "display:inline")
    locationURL();
});
