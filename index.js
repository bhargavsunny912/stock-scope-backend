import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import limiter from "./Utils/rateLimit.js";
import NodeCache from "node-cache";
import fetch from "node-fetch"; 
import apiRoutes from "./Routes/apiRoutes.js"; 
import authRoutes from "./Routes/authRoutes.js";
import Connection from "./Configs/connection.js";
import cookieParser from "cookie-parser";  
import passport from "./Configs/passport.js";


dotenv.config({quiet: true});

const app = express();
const server = http.createServer(app);

Connection();

const PORT = process.env.PORT || 8000;

app.use(cors({
  credentials:true,
  origin:"https://stock-scope-frontend-nine.vercel.app/"
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(passport.initialize());

// Rate Limiting (Protection)
app.use(limiter);

// Caching (Reduce API calls)
const cache = new NodeCache({ stdTTL: 60 }); // 60 sec cache

/* ==============================
   SOCKET.IO (Live Updates)
================================= */

const io = new Server(server, {
  cors: { 
    origin: "*" ,
    methods:["GET", "POST"]
  },
});

const INDEX_SYMBOLS = {
  nifty: "^NSEI",
  banknifty: "^NSEBANK",
  sensex: "^BSESN",
};

// Index symbols 
const INDEX_POLL_INTERVAL = 5 * 1000;

// In-memory cache for index values
const indexLiveCache = {
  nifty: null,
  sensex: null,
  banknifty: null,
};


/* ==============================
   SOCKET.IO (Fixed for multiple users)
================================= */
io.on("connection", (socket) => {

    // Send latest cached index data immediately on new connection
  Object.entries(indexLiveCache).forEach(([name, data]) => {
    if (data) {
      socket.emit("indexUpdate", { name, data });
    }
  });


  console.log("Client connected:", socket.id);

  // Use a local variable inside the connection scope
  let userIntervalId;

  socket.on("subscribe", ({ symbol, duration }) => {
    if (userIntervalId) clearInterval(userIntervalId);

    const [range, interval] = duration.split("-");

    const fetchData = async () => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' } // Bypasses some blocks
        });

        if (!response.ok) throw new Error(`Yahoo API error: ${response.status}`);

        const data = await response.json();
        
        // Only emit if the data structure is correct
        if (data?.chart?.result) {
          socket.emit("priceUpdate", data);
        }
      } catch (error) {
        console.error("Socket Fetch Error:", error.message);
      }
    };

    fetchData();
    userIntervalId = setInterval(fetchData, 5000);
  });

  socket.on("disconnect", () => {
    if (userIntervalId) clearInterval(userIntervalId);
    console.log("Client disconnected:", socket.id);
  });
});


/* ==============================
   INDEX LIVE POLLING (SOCKET.IO)
================================= */

// Background polling function
const pollIndexAndEmit = async (indexName, symbol) => {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=2m`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) return;

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    if (!result) return;

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prev = meta.chartPreviousClose;

    if (price == null || prev == null) return;

    const change = +(price - prev).toFixed(2);
    const changePer = prev !== 0? +((change / prev) * 100).toFixed(2): 0;
    const formatted = { price, change, changePer };

    // Emit only if price actually changed
    if (indexLiveCache[indexName]?.price !== price) {
      indexLiveCache[indexName] = formatted;

      io.emit("indexUpdate", {
        name: indexName,
        data: formatted,
      });
    }
  } catch (err) {
    console.error(`Index polling error (${indexName}):`, err.message);
  }
};

// Start polling once (global)
setInterval(() => {
  Object.entries(INDEX_SYMBOLS).forEach(([name, symbol]) => {
    pollIndexAndEmit(name, symbol);
  });
}, INDEX_POLL_INTERVAL);

app.use("/auth",authRoutes);
app.use("/api",apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
