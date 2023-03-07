function WeatherData(data) {
  this.name = data.name;
  this.icon = data.weather[0].icon;
  this.description = data.weather[0].description;
  this.temperatureC = Math.round(data.main.temp - 273.15);
  this.temperatureF = Math.round((9 / 5) * (data.main.temp - 273) + 32);
}

async function fetchLocationWeatherData(location) {
  try {
    const key = "MY-KEY";
    let response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`,
      { mode: "cors" }
    );
    let data = await response.json();

    return data;
  } catch (error) {
    alert(error);
  }
}

async function processWeatherData(location) {
  let data = await fetchLocationWeatherData(location);

  // When no message on data, return success data
  if (!data.message) {
    return new WeatherData(data);
  }

  throw Error(data.message);
}

async function displayWeatherData(location) {
  try {
    let weatherData = await processWeatherData(location); // get location weather data object
    let temperatureCelsius = weatherData.temperatureC;
    let temperatureFahrenheit = weatherData.temperatureF;

    // Clear report to allow for new content
    weatherReportLocationName.textContent = "";
    temperatureValue.textContent = "";
    weatherReportDescription.textContent = "";

    // Location name and description
    weatherReportLocationName.textContent = weatherData.name;
    weatherReportIcon.src = `icons/${weatherData.icon}.svg`;
    weatherReportDescription.textContent = weatherData.description;

    // TODO: function to add active class and display temperature in C/F
    if (activeTemperatureUnit == "C") {
      temperatureValue.textContent = temperatureCelsius;
    } else {
      temperatureValue.textContent = temperatureFahrenheit;
    }
  } catch (error) {
    alert(error);
  }
}

const searchButton = document.querySelector("form>button");
const searchField = document.querySelector("input#search-field");
const weatherReportContainer = document.querySelector(
  ".weather-report__container"
);
const weatherReportLocationName = document.querySelector(
  ".weather-report__location-name"
);
const temperatureValue = document.querySelector(".temperature-value");
const temperatureToggleOptions = document.querySelectorAll(
  ".temperature-toggle__option"
);
const weatherReportDescription = document.querySelector(
  ".weather-report__description"
);
const weatherReportIcon = document.querySelector(".weather-report__icon");

let activeTemperatureUnit = "C";

// init
let locationSearched = "Copenhagen";
displayWeatherData(locationSearched);

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  locationSearched = searchField.value;
  displayWeatherData(locationSearched);

  searchField.value = "";
});

temperatureToggleOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    if (e.target.id == "celsius") {
      activeTemperatureUnit = "C";
      temperatureToggleOptions[0].classList.add("active");
      temperatureToggleOptions[1].classList.remove("active");
    } else {
      activeTemperatureUnit = "F";
      temperatureToggleOptions[0].classList.remove("active");
      temperatureToggleOptions[1].classList.add("active");
    }

    displayWeatherData(locationSearched);
  });
});
