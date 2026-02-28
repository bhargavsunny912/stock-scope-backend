import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 });

const handleChartDataApi=async (req, res) => {
  const { symbol, range = "1mo", interval = "1d" } = req.query;

  if (!symbol) return res.status(400).json({ error: "Symbol is required" });

  const cacheKey = `${symbol}-${range}-${interval}`;     
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      // This catches the 500/404 errors from Yahoo
      const errorText = await response.text();
      console.error("Yahoo API Response Error:", errorText);
      return res.status(response.status).json({ error: "External API error" });
    }

    const data = await response.json();

    // Ensure we don't cache a "null" result
    if (data?.chart?.result) {
      cache.set(cacheKey, data);
      res.json(data);
    } else {
      res.status(404).json({ error: "No data found for this symbol" });
    }
  } catch (err) {
    console.error("Server Route Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handleChartDataApi;