let lat = 0;
let lon = 0;
let dt = 0;
let myCitySearch = document.getElementById("search-input").value;
let temperature;
let cityCode = myCitySearch;

let liveWeatherLink = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=bd4f86e586f7c181c1e585358d3c507c`
// let date = new Date(current.dt * 1000);
let date = moment().format("ddd D MMM YYYY");
$("#liveWeather").text(date);
let cityTitle = $("<h>");
let icon = $("<img>");

function addedCity(city) {

    console.log(`'myCitySearch= `, myCitySearch);
    searchRecord = findData();
    let cityFind = $("<div>")
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
        myCitySearch = searchRecord[i];
        let cityFind = $("<div>")
        cityFind.attr('id', myCitySearch)
        cityFind.text(myCitySearch)
        cityFind.addClass("h4")

        $(".history").append(cityFind)
    }
};

// displayData();


function weatherNow(city) {

    $(".fiveDay").empty();
    $(".city").empty()

    cityTitle.addClass("h3")
    temperature = $("<div>")
    let wind = $("<div>")
    let humidity = $("<div>")
    icon.addClass("icon");
    let dateTime = $("<div>")

    $(".city").addClass("list-cities")
    $(".city").append(cityTitle)
    $(".city").append(dateTime)
    $(".city").append(icon)
    $(".city").append(temperature)
    $(".city").append(wind)
    $(".city").append(humidity)
}
function locationURL() {
    // get location from search
    // fetch weather data
    // console.log("locationURL");
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=Leeds&limit=5&appid=bd4f86e586f7c181c1e585358d3c507c")
        .then(response => response.json())
        .then(citySearch => {
            console.log("myCitySearch = ", citySearch);
            let city = citySearch[0];
            console.log(city.lat);
            console.log(city.lon);
            // appendCity();
            // adding to local storage
            addedCity(city);
            // changing src attributes in the DOM
            $("#icon").attr('src', icon);
            weatherNow(city)
        })
} {
    fetch(liveWeatherLink)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let displayIcon = data.list[0].weather[0].icon;
            let imageSource = "https://openweathermap.org/img/wn/" + displayIcon + ".png";
            document.querySelector("#imageWeather").setAttribute('src', imageSource)
            cityTitle.text(cityCode);

            // dateTime.text("(" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")");

            temperature.text("temperature: " + data.current.temp + "fahreinheight");
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


    locationURL();
}
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
    document.querySelector(".subtitle").setAttribute("style", "display:inline")
    // document.getElementById("search-input").value = event.target.id;
    locationURL();
});


