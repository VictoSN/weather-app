export default async function handler(req, res) {
    const API_KEY = process.env.PEXELS_KEY;
    const query = req.query.query;

    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&orientation=landscape&size=large&per_page=50`,
            {
                headers: {
                    Authorization: API_KEY
                }
            }
        );

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch image" });
    }
}