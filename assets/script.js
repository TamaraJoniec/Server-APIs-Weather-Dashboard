let lat = 0;
let lon = 0;
let dt = 0;
let temp;
let name;
let wind;
let myCitySearch = document.querySelector("#search-input").textContent;
let temperature;
let humidity;
let cityCode = myCitySearch;
let displayIcon;
let cityFind = 0;
let imageSource;
// let date = new Date(current.dt * 1000);
let date = moment().format("ddd D MMM YYYY");
$("#liveWeather").text(date);
let cityTitle;
let icon;
let dateTime;

function locationURL() {
    // get location from search
    // fetch weather data
    // console.log("locationURL");
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=bd4f86e586f7c181c1e585358d3c507c
    `)
        .then(response => response.json())
        .then(citySearch => {
            let city = citySearch[0];
            weatherInfo(city);
            // console.log(city.lat);
            // console.log(city.lon);
            // appendCity();
            // adding to local storage
            addedCity(city);
            // changing src attributes in the DOM
            $("#icon").attr('src', icon);
            weatherNow(city)
            // return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=0780a07cd4320778ef6285e7998f12ae`)
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
            document.querySelector("#imageWeather").setAttribute('src', imageSource)
            cityTitle.text(cityCode);

            // dateTime.text("(" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")");

            temperature.text("temperature: " + data.list[0].main.temp + "fahreinheight");
            humidity.text("Humidity: " + data.list[0].main.humidity + " %");
            wind.text("Wind Speed: " + data.list[0].wind.speed + " mph");

            for (let i = 1; i < 6; i++) {
                // creating for loop to make weather cards as and when user searches a city
                let weatherCard = $("<div>")
                this["forecastDate" + i] = $("<h>")
                this["forecastIcon" + i] = $("<img>")
                this["forecastTemp" + i] = $("<div>")
                this["forecastWind" + i] = $("<div>")
                this["forecastHumidity" + i] = $("<div>")

                this["forecastDay" + i] = new Date(data.dt * 1000);

                (this["forecastDate" + i]).text(((this["forecastDay" + i]).getMonth() + 1) + "/" + (this["forecastDay" + i]).getDate() + "/" + (this["forecastDay" + i]).getFullYear());
                (this["forecastTemp" + i]).text("Temperature: " + data.list[0].main.temp + " F");
                (this["forecastWind" + i]).text("Wind: " + data.list[0].wind.speed + " MPH");
                (this["forecastHumidity" + i]).text("Humidity: " + data.list[0].humidity + " %");
                (this["weatherIcon" + i]) = data.list[0].weather[0].icon;

                let DateimageSource = "https://openweathermap.org/img/wn/" + (this["displayIcon" + i]) + ".png";
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

    searchRecord = findData();
    cityFind = $("<div>")
    cityFind.attr('id', city.name)
    cityFind.text(city.name)
    cityFind.addClass("h5")

    if (searchRecord.includes(city.name) === false) {
        $(".history").append(cityFind)
    }
    $(".subheading").attr("style", "display:inline")
    cityLocalStorage(city.name);
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
function cityLocalStorage(city) {
    let addedList = findData();

    if (searchRecord.includes(city) === false) {
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
        cityFind.addClass("h4")
        $(".history").append(cityFind)
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
    document.querySelector(".subtitle").setAttribute("style", "display:inline")
    // document.getElementById("search-input").value = event.target.id;
    locationURL();
});