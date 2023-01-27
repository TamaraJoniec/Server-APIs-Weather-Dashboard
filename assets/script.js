fetch("http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=0780a07cd4320778ef6285e7998f12ae")
.then(response => response.json())
.then(data => {
    console.log(data);
})

fetch("api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=0780a07cd4320778ef6285e7998f12ae")
.then(response => response.json())
.then(data => {
    console.log(data);
})