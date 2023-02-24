// Assuming that "data" is an object containing the 5-day forecast data

// Get the current date
const currentDate = new Date();

// Loop over the next 5 days
for (let i = 0; i < 5; i++) {
  // Calculate the date for this day
  const forecastDate = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);

  // Create a card element for this day
  const weatherCard = document.createElement("div");
  card.classList.add("forecast-card");

  // Add the day of the week to the card
  const dayOfWeek = forecastDate.toLocaleDateString("en-US", { weekday: "long" });
  const dayOfWeekElement = document.createElement("div");
  dayOfWeekElement.classList.add("day-of-week");
  dayOfWeekElement.innerText = dayOfWeek;
  card.appendChild(dayOfWeekElement);

  // Add the forecast details to the card (e.g. temperature, weather icon, etc.)
  // ...

  // Add the card to the forecast container
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.appendChild(weatherCard);
}
const forecastIcon = $("<img>");
const forecastTemp = $("<div>");
const forecastWind = $("<div>");
const forecastHumidity = $("<div>");

// Set the values for this day
forecastIcon.attr('src', `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`);
forecastTemp.text(`Temperature: ${data.list[i].main.temp} F`);
forecastWind.text(`Wind: ${data.list[i].wind.speed} MPH`);
forecastHumidity.text(`Humidity: ${data.list[i].main.humidity} %`);

// Add the elements to the card
weatherCard.appendChild(forecastIcon[0]);
weatherCard.appendChild(forecastTemp[0]);
weatherCard.appendChild(forecastWind[0]);
weatherCard.appendChild(forecastHumidity[0]);

// Add the card to the forecast container
const forecastContainer = document.getElementById("forecast-container");
forecastContainer.appendChild(weatherCard);