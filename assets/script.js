// global variables

let iconDivs = `<div id="icon"><img id="weather-icon" src="http://openweathermap.org/img/wn/10d@2x.png" alt="Weather Icon"</div>`
let recentCity = "";
let location = document.getElementById("search-input").value;
let codeIcon = list.weather[0].icon;
let urlIcon = "https://openweathermap.org/img/w/" + codeIcon + ".png";
let city = document.getElementById("search-input").value;
let presentLocation = document.getElementById("search-input").value;

// DOM elements
document.getElementById("main-city").innerText = response.name;
document.getElementById("forecast5").innerHTML = HTMLforecast5;

// adding city to local storage
function addedCity(createPlace) {
    let alreadyLogged = false;
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage['city' + i] === createPlace) {
            alreadyLogged = true;
            break;
        }
    }
    if (alreadyLogged === false) {
        localStorage.setItem('city' + localStorage.length, createPlace);
    }
}

let weatherNow = () => {
    // get location from search
    // fetch weather data
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=Leeds&limit=5&appid=0780a07cd4320778ef6285e7998f12ae")
        .then(response => response.json())
        .then(citySearch => {
            let city = citySearch[0]
            console.log(city.lat);
            console.log(city.lon);

            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=0780a07cd4320778ef6285e7998f12ae`)

        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // adding to local storage
            addedCity(city);
            // changing src attributes in the DOM
            document.getElementById("weather-icon").setAttribute('src', urlIcon);
            // moments for timings
            let liveTime = list[0].weather.dt;
            let liveTimeOFFset = response.timezone;
            let liveHourOFFset = liveTimeOFFset / 60 / 60;
            now = moment.unix(liveTime).utc().utcOffset(liveHourOFFset);
        });
}
weatherNow();


let htmlWeatherNow = `
            <h3>${response} ${now.format("MM/DD/YYYY HH:mm:ss")}<img src="${displayIcon}"></h3>
            <ul class="list">
                <li>Temp.: ${response.main.temp}</li>
                 <li>Wind: ${response.wind.speed} mph</li>
                 <li>Humidity: ${response.main.humidity}%</li>
            </ul>`;
document.getElementById("weather-now").innerHTML = htmlWeatherNow;

// to display the record of searches


let displaySearches = () => {
    document.querySelector('#search-history').replaceChildren();
    if (localStorage.length === 0) {
        if (recentCity) {
            document.querySelector('#search-input').setAttribute("value", recentCity);
        } else {
            document.querySelector('#search-input').setAttribute("value", "Leeds");
        }
    } else {
        // creating a log of searched cities to append
        let recentactiveCity = "city" + (localStorage.length - 1);
        recentCity = localStorage.getItem(recentactiveCity);
        document.querySelector('#search-input').setAttribute("value", recentCity);
    }
    for (let i = 0; i < localStorage.length; i++) {
        let location = localStorage.getItem("city" + i);
        let activeCity;
        if (presentLocation === "") {
            presentLocation = recentCity;
        }
        if (location === presentLocation) {
            activeCity = `<button type="button" class="btn btn-secondary">${location}</button></li>`;
        } else {
            activeCity = `<button type="button" class="btn btn-secondary">${location}</button></li>`;
        }
        document.querySelector('#search-history').prepend(activeCity);
    }
}

let forecast5 = (event) => {
    // fetch weather data
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=Leeds&limit=5&appid=0780a07cd4320778ef6285e7998f12ae")
        .then(response => response.json())
        .then(citySearch => {
            let city = citySearch[0]
            console.log(city.lat);
            console.log(city.lon);

            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=0780a07cd4320778ef6285e7998f12ae`)

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


let HTMLforecast5 = `<h1>Five Day Weather Forecast</h1>
<section class="d-inline-flex flex-wrap" id="forecast5Cards">`
for (let i = 0; i < localStorage.length; i++) {
    let days = list[i].weather.dt;
    let time = days.dt;
    let timeDifference = response.location.timezone;
    let hourDifference = timeDifference / 60 / 60;
    rightNow = moment.unix(time).utc().utcOffset(hourDifference);
    // formula to get icon
    codeIcon = list.weather[0].icon;
    // concatenate the variable with the url
    displayIcon = "https://openweathermap.org/img/w/" + city.weather[0].icon + ".png";

    if (rightNow.format("HH:mm:ss") === "11:00:00" || rightNow.format("HH:mm:ss") === "12:00:00" || rightNow.format("HH:mm:ss") === "13:00:00") {
        HTMLforecast5 += `
            <div class="weather-card card m-2 p0">
                <ul class="list-unstyled p-3">
                    <li>${rightNow.format("MM/DD/YYYY")}</li>
                    <li class="weather-icon"><img src="${urlIcon}"></li>
                    <li>Temp: ${days.main.temp}&#8457;</li>
                    <br>
                    <li>Humidity: ${days.main.humidity}%</li>
                </ul>
            </div>`;
    }
}
HTMLforecast5 += `</div>`;


//Event listener for search button
document.getElementById("search-button").addEventListener("click", (event) => {
    event.preventDefault();
    presentLocation = document.getElementById("search-input").value;
    weatherNow(event);
});
//Event listener for recent city search buttons
document.getElementById("search-history").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("search-input").val(event.target.textContent);
    presentLocation = document.getElementById("search-input").value;
    weatherNow(event);
}
);

displaySearches();
