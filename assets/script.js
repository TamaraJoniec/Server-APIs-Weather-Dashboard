// * Create a weather dashboard with form inputs.
//   * When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
//   * When a user views the current weather conditions for that city they are presented with:
//     * The city name
//     * The date
//     * An icon representation of weather conditions
//     * The temperature
//     * The humidity
//     * The wind speed
//   * When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
//     * The date
//     * An icon representation of weather conditions
//     * The temperature
//     * The humidity
//   * When a user click on a city in the search history they are again presented with current and future conditions for that city

// global variables

let addedCity = (createPlace) => {
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
let weatherNow = (event) => {
    // put whole fetch inside an event listener
    //  pull out string from the button: use event delegation event.target.textContent

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
            let displayIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
            // moments for timings
            let liveTime = response.dt;
            let liveTimeOFFset = response.timezone;
            let liveHourOFFset = liveTimeOFFset / 60 / 60;
            let now = moment.unix(liveTime).utc().utcOffset(liveHourOFFset);
        })
    displaySearches();
}
weatherNow();

// to display the record of searches
let displaySearches = () => {
    document.querySelector('#search-history').empty();
    if (localStorage.length === 0) {
        if (recentCity) {
            document.querySelector('#search-input').setAttribute("value", recentCity);
        } else {
            document.querySelector('#search-city').setAttribute("value", "Leeds");
        }
    } else {
        // creating a log of searched cities to append
        let recentactiveCity = "city" + (localStorage.length - 1);
        recentCity = localStorage.getItem(recentactiveCity);
        document.querySelector('#search-city').setAttribute("value", recentCity);
    }
    for (let i = 0; i < localStorage.length; i++) {
        let location = localStorage.getItem("city" + i);
        let activeCity;
        if (presentLocation===""){
            presentLocation=recentCity;
        }
        if (location === presentLocation) {
            activeCity = `<button type="button" class="btn btn-secondary">${location}</button></li>`;
        } else {
            activeCity = `<button type="button" class="btn btn-secondary">${location}</button></li>`;
        } 
        document.querySelector('#search-history').prepend(activeCity);
}
}

displaySearches();

//Event listener for search button
document.getElementById("search-button").addEventListener("click", (event) => {
    event.preventDefault();
    presentLocation = document.getElementById("search-input").value;
    weatherNow(event);
    });