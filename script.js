
const searchBox = document.querySelector(".search input")
const searchButton = document.querySelector(".search button")
const searchBtn = document.querySelector(".forecast")
const liveButton = document.querySelector(".live-location");
const currentDate = document.querySelector(".date");
const weatherDesc = document.querySelector(".temp-description");
const city_Name = document.querySelector(".cityName");
const iconImg = document.querySelector(".weather-icon");
const weatherInfo = {};
const KELVIN = 273;

const apiKey = "2e15e1b77b2f79d3614c9be5d5c9b77b";
const createWeatherForecast = (weatherItem) => {
    return `
    <div class="forecast-container">
    <div class="app-title">
        <p>${weatherItem.dt_txt}</p>
    </div>
    <div class="notification"></div>
    <div class="temp-value">
        <p> ${(Math.round(weatherItem.main.temp) - KELVIN)}° <span>C</span></p>
    </div>
    <div class="temp-description">
        <p>${weatherItem.weather[0].description} </p>
    </div>
    <div class="location">
        <p>  </p>
    </div>
    <div class="weather-icon"><img src="http://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png"/> </div>
</div>
    `
}
async function getLiveWeather(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(apiUrl)
    var weatherInfo = await response.json()
    console.log(weatherInfo)
    const uniqueForecastDays = [];
    const fiveDaysForecast = weatherInfo.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
        }
    })
    console.log(fiveDaysForecast.dt_txt)
    const apiUrl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response2 = await fetch(apiUrl2)
    var weatherInfo2 = await response2.json()
    console.log(weatherInfo2)
    const forecastDate = weatherInfo2.dt;
    var day = new Date(forecastDate * 1000);

    // console.log(day.toUTCString()) 'Fri, 15 Jan 2021 04:32:29 GMT'
    // console.log(day.toDateString())  'Fri Jan 15 2021'
    currentDate.innerHTML = day.toDateString();
    city_Name.innerHTML = weatherInfo2.name;
    document.querySelector(".temp p").innerHTML = (Math.round(weatherInfo2.main.temp) - KELVIN) + " °C";
    document.querySelector(".humidity").innerHTML = "Humidity:" + weatherInfo2.main.humidity + "%";
    document.querySelector(".wind").innerHTML = "Wind:" + weatherInfo2.wind.speed + "km/h";
    iconImg.innerHTML = `<img src="http://openweathermap.org/img/w/${weatherInfo2.weather[0].icon}.png"/>`
    fiveDaysForecast.forEach((item) => {
        searchBtn.insertAdjacentHTML("beforeend", createWeatherForecast(item));
    });
}
async function getWeather() {
    const cityName = searchBox.value.trim();
    if (!cityName === "") return alert("No City Name Found!");
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    const response2 = await fetch(apiUrl2)
    var weatherInfo = await response2.json()
    console.log(weatherInfo);
    const uniqueForecastDays = [];
    const fiveDaysForecast = weatherInfo.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
        }
    })
    const response = await fetch(apiUrl)
    var weatherInfo = await response.json()
    console.log(weatherInfo);
    const forecastDate = weatherInfo.dt;
    var day = new Date(forecastDate * 1000);
    currentDate.innerHTML = day.toDateString();
    city_Name.innerHTML = weatherInfo.name;
    weatherDesc.innerHTML = weatherInfo.weather[0].description;
    document.querySelector(".temp p").innerHTML = (Math.round(weatherInfo.main.temp) - KELVIN) + " °C";
    document.querySelector(".humidity").innerHTML = "Humidity:" + weatherInfo.main.humidity + "%";
    document.querySelector(".wind").innerHTML = "Wind:" + weatherInfo.wind.speed + "km/h";
    iconImg.innerHTML = `<img src="http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png"/>`
    fiveDaysForecast.forEach((item) => {
        searchBtn.insertAdjacentHTML("beforeend", createWeatherForecast(item));
    });
}
searchButton.addEventListener("click", getWeather)
liveButton.addEventListener("click", () => {
    let setPosition = (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        getLiveWeather(latitude, longitude);
    }
    let showError = (error) => {alert("Browser Doesn't Support Geolocation"); }
    // CHECK IF BROWSER SUPPORTS GEOLOCATION
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);

    } else {
        alert("Browser Doesn't Support Geolocation");
    }
})