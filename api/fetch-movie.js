// Vercel Serverless Function to fetch movie data securely
// Place your API key in Vercel's Environment Variables as MOVIE_API_KEY

export default async function handler(req, res) {
  const { query } = req;
  const apiKey = process.env.MOVIE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set' });
  }

  // Example: Forward query to external API (replace with your actual API URL and params)
  const movieTitle = query.title;
  if (!movieTitle) {
    return res.status(400).json({ error: 'Missing movie title' });
  }

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieTitle)}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
}
