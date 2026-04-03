const WEATHER_API_KEY = "x" // Enter your OpenWeather '5 day weather forecast' API KEY
const PHOTO_API_KEY = "x" // Enter your Pexels API KEY

const searchBox = document.getElementById("searchBox");
const submitButton = document.getElementById("submitButton");
const cityDiv = document.getElementById("cityDiv");

async function fetchWeather() {
    const unitMeasurement = document.querySelector("input[name=unitRadio]:checked");
    const citySearched = searchBox.value;
    let units = unitMeasurement.value;

    // Fetch the geolocation data of the key for latitude and longitude
    const cityRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&limit=1&appid=${WEATHER_API_KEY}`)
    const cityData = await cityRes.json();
    
    // Use the city data to fetch the weather data
    const weatherRes = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${cityData[0].lat}&lon=${cityData[0].lon}&units=${units}&appid=${WEATHER_API_KEY}`)
    const weatherData = await weatherRes.json();

    console.log(weatherData);
    return weatherData;
}

function renderWeather(weatherData) {
    const name = weatherData.city.name;
    const lat = weatherData.city.coord.lat;
    const lon = weatherData.city.coord.lon;

    const temp = weatherData.list[0].main.temp;
    const humidity = weatherData.list[0].main.humidity;
    const pressure = weatherData.list[0].main.pressure;
    const weather = weatherData.list[0].weather[0].main;

    return `
        <div>
            <h1 id="cityName">${name}</h1>
            <text id="latLot">Lat: ${lat} | Lot: ${lon}</text>
            <h3 id="temp">Temp: ${temp}</h3>
            <h3 id="humid">Humidity: ${humidity}%</h3>
            <h3 id="press">Pressure: ${pressure} hPa</h3>
            <h3 id="weat">Weather: ${weather}</h3>
        </div>
    `
}

async function updateBackground() {
    const citySearched = searchBox.value;

    // Search for city's images using pexels
    const url = `https://api.pexels.com/v1/search?query=${citySearched}&orientation=landscape&size=large&per_page=15`;
    const cityRes = await fetch(url, {
        headers: {
            Authorization: PHOTO_API_KEY
        }
    });
    const cityPhoto = await cityRes.json();

    const randomIndex = Math.floor(Math.random() * 15);
    console.log(cityPhoto.photos[randomIndex].src);

    // Set image of city as background
    document.body.style.backgroundImage = `url(${cityPhoto.photos[randomIndex].src.large2x})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}

function checkInput() {
    if(searchBox.value !== "") {
        return true;
    }
        
    return false;
}

async function processWeather() {
    cityDiv.innerHTML = "";

    if(checkInput()) {
        cityDiv.insertAdjacentHTML("beforeend", renderWeather(await fetchWeather()));
        updateBackground();
    } else {
        cityDiv.insertAdjacentHTML("beforeend", `<h3>Please Enter a Valid Input</h3>`);
    }
}

submitButton.addEventListener("click", () => processWeather());
document.addEventListener("change", (e) => {
    if (e.target.name === "unitRadio") {
        processWeather();
    }
})

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if(key === "Enter") {
        event.preventDefault();
        processWeather();
    }
});

window.onload = function() {
    const randomIndex = Math.floor(Math.random() * 20);
    const defaultCities = [
        "London",
        "New York",
        "Tokyo",
        "Paris",
        "Dubai",
        "Singapore",
        "Hong Kong",
        "Los Angeles",
        "Chicago",
        "Sydney",
        "Toronto",
        "Berlin",
        "Rome",
        "Barcelona",
        "Amsterdam",
        "Istanbul",
        "Seoul",
        "Bangkok",
        "Moscow",
        "Rio de Janeiro"
    ];

    searchBox.value = defaultCities[randomIndex];
    processWeather();
}