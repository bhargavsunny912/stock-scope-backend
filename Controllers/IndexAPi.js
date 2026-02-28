import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 });

const INDEX_SYMBOLS = {
  nifty: "^NSEI",
  banknifty: "^NSEBANK",
  sensex: "^BSESN",
};

const handleIndexDataApi=async (req, res) => {
  try {
    const indexName = req.params.name.toLowerCase();
    const symbol = INDEX_SYMBOLS[indexName];   

    if (!symbol) {
      return res.status(400).json({ error: "Invalid index name" });
    }

    const cacheKey = `index-${symbol}`; 
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`;

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Yahoo Index API Error:", errorText);
      return res
        .status(response.status)
        .json({ error: "External API error while fetching index" });
    }

    const data = await response.json();

    // Ensure valid data before caching
    if (data?.chart?.result) {
      cache.set(cacheKey, data);
      return res.json(data);
    } else {
      console.error("Invalid Yahoo Index Data:", data);
      return res.status(404).json({ error: "No data found for this index" });
    }
  } catch (err) {
    console.error("Index Route Error:", err);
    res.status(500).json({ error: "Failed to fetch index data" });
  }
}

export default handleIndexDataApi;