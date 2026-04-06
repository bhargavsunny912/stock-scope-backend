const getStockData = async () => {
  try {
    const symbols = ["^NSEI", "^BSESN", "^NSEBANK"];

    const requests = symbols.map((symbol) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

      return fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Yahoo API error: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          const price =
            data?.chart?.result?.[0]?.meta?.regularMarketPrice;

          if (price == null) {
            throw new Error(`Invalid data for ${symbol}`);
          }

          return {
            symbol,
            price,
          };
        });
    });

    // 🔥 Run all API calls in parallel
    const results = await Promise.all(requests);

    return results;
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    throw new Error("Failed to fetch stock data");
  }
};

export default getStockData;