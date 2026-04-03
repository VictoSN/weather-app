const API_KEY = "x" // Enter your OpenWeather '5 day weather forecast' API KEY

const searchBox = document.getElementById("searchBox");
const submitButton = document.getElementById("submitButton");
const cityDiv = document.getElementById("cityDiv");

async function fetchWeather() {
    const citySearched = searchBox.value;
    let units = "metric";

    // Fetch the geolocation data of the key for latitude and longitude
    const cityRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&limit=1&appid=${API_KEY}`)
    const cityData = await cityRes.json();
    
    // Use the city data to fetch the weather data
    const weatherRes = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${cityData[0].lat}&lon=${cityData[0].lon}&units=${units}&appid=${API_KEY}`)
    const weatherData = await weatherRes.json();

    console.log(weatherData.list[0].main);
    return weatherData.list[0].main;
}

function renderWeather(weatherData) {
    return `
        <div>
            <p>Temp: ${weatherData.temp}</p>
            <p>Humidity: ${weatherData.humidity}</p>
            <p>Pressure: ${weatherData.pressure}</p>
        </div>
    `
}

async function processWeather() {
    cityDiv.innerHTML = "";
    cityDiv.insertAdjacentHTML("beforeend", renderWeather(await fetchWeather()));
}

submitButton.addEventListener("click", () => processWeather());

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if(key === "Enter") {
        event.preventDefault();
        processWeather();
    }
});