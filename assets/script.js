fetch("http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=0780a07cd4320778ef6285e7998f12ae")
.then(response => response.json())
.then(citySearch => {
    let city = citySearch[0]
    console.log(city.lat);
    console.log(city.lon);

    return fetch(`api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=0780a07cd4320778ef6285e7998f12ae`)

})

.then(response => response.json())
.then(data => {
    console.log(data);
})