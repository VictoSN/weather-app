export default async function handler(req, res) {
    const API_KEY = process.env.OPENWEATHER_KEY;
    const city = req.query.city;
    const units = req.query.units;

    try {
        // Get lat & lon
        const geoRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoRes.json();

        if(!geoData.length) {
            return res.status(400).json({ error: "Invalid city" });
        }
        const { lat, lon } = geoData[0];

        // Get weather data
        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&lang=en&appid=${API_KEY}`
        );
        const weatherData = await weatherRes.json();
        res.status(200).json(weatherData);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
}