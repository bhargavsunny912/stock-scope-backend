import fetchIndianAPI from "../Controllers/fetchApiLayout.js";
import dotenv from "dotenv";
dotenv.config({quiet:true});

export const handleTrendingApi=async(req, res) => {
  try {
    const data = await fetchIndianAPI("trending");
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch trending data" });
  }
};

export const handleMutualfundApi=async (req, res) => {
  try {
    const data = await fetchIndianAPI("mutual_funds");
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch mutual funds" });
  }
};

export const handleIpoApi=async (req, res) => {
  try {
    const data = await fetchIndianAPI("ipo");
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch IPO data" });
  }
};

export const handleNseApi=async (req, res) => {
  try {
    const data = await fetchIndianAPI("NSE_most_active");
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch NSE data" });
  }
};

export const handleBseApi=async (req, res) => {
  try {
    const data = await fetchIndianAPI("BSE_most_active");
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch BSE data" });
  }
};

export const handleStockApi=async (req, res) => {
  try {
    const stock = req.params.name;
    const response = await fetch(
      `https://stock.indianapi.in/stock?name=${stock}`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.INDIAN_API_KEY,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
}
