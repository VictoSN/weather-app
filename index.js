const WEATHER_API_KEY = "x" // Enter your OpenWeather '5 day weather forecast' API KEY
const PHOTO_API_KEY = "x" // Enter your Pexels API KEY

const searchBox = document.getElementById("searchBox");
const submitButton = document.getElementById("submitButton");
const cityDiv = document.getElementById("cityDiv");

function checkCity(cityData) {
    console.log(cityData);
    if(cityData.length !== 0) {
        return true;
    }
        
    return false;
}

async function fetchWeather() {
    const unitMeasurement = document.querySelector("input[name=unitRadio]:checked");
    const citySearched = searchBox.value;
    let units = unitMeasurement.value;

    // Fetch the geolocation data of the key for latitude and longitude
    const cityRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&limit=1&appid=${WEATHER_API_KEY}`)
    const cityData = await cityRes.json();
    
    if (checkCity(cityData)) {
        // Use the city data to fetch the weather data
        const weatherRes = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${cityData[0].lat}&lon=${cityData[0].lon}&units=${units}&lang=en&appid=${WEATHER_API_KEY}`)
        const weatherData = await weatherRes.json();
    
        console.log(weatherData);
        return weatherData;
    } else {
        cityDiv.insertAdjacentHTML("beforeend", `<div id="errorData">Please Enter a Valid City</div>`);
    }
}

function temperatureUnit() {
    const unitMeasurement = document.querySelector("input[name=unitRadio]:checked");
    let units = unitMeasurement.value;

    switch (units) {
        case "metric": return "C";
        case "imperial": return "F";
        case "kelvin": return "K";
    }
}

function renderWeather(weatherData) {
    const name = weatherData.city.name;

    const temp = Math.round(weatherData.list[0].main.temp);
    const humidity = weatherData.list[0].main.humidity;
    const pressure = weatherData.list[0].main.pressure;
    const weather = weatherData.list[0].weather[0].main;

    return `
        <div id="mainData">
            <p id="cityName">${name}</p>
            <p id="temp">${temp}°${temperatureUnit()}</p>
            <p id="weat">${weather}</p>
        </div>
        <div id="additionalData">
            <text id="humid">H: ${humidity}%</text>
            <text id="humid">P: ${pressure} hPa</text>
        </div>
    `
}

async function updateBackground() {
    const citySearched = searchBox.value;

    // Search for city's images using pexels
    const url = `https://api.pexels.com/v1/search?query=${citySearched}&orientation=landscape&size=large&per_page=50`;
    const cityRes = await fetch(url, {
        headers: {
            Authorization: PHOTO_API_KEY
        }
    });
    const cityPhoto = await cityRes.json();

    const randomIndex = Math.floor(Math.random() * 50);
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
        cityDiv.insertAdjacentHTML("beforeend", `<div id="errorData">Please Enter a Valid Input</div>`);
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
    const randomIndex = Math.floor(Math.random() * 50);
    const defaultCities = [
        "London","Paris","New York","Tokyo","Dubai","Singapore","Hong Kong","Los Angeles","Chicago","San Francisco",
        "Sydney","Melbourne","Toronto","Vancouver","Berlin","Rome","Madrid","Barcelona","Amsterdam","Vienna",
        "Prague","Lisbon","Athens","Istanbul","Seoul","Beijing","Shanghai","Bangkok","Kuala Lumpur","Jakarta",
        "Manila","Mumbai","Delhi","Bangalore","Cairo","Cape Town","Johannesburg","Moscow","Saint Petersburg","Zurich",
        "Geneva","Stockholm","Oslo","Copenhagen","Helsinki","Dublin","Edinburgh","Manchester","Birmingham","Boston"
    ];

    searchBox.value = defaultCities[randomIndex];
    processWeather();
}