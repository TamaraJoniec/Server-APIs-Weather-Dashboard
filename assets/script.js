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
let myAPI = "0780a07cd4320778ef6285e7998f12ae";
let city = "";
let previousSearch = "";

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
})

