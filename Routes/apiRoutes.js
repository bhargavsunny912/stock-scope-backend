import express from "express";
import {handleTrendingApi, handleMutualfundApi, handleIpoApi, handleNseApi, handleBseApi, handleStockApi} from "../Controllers/customFetchApi.js";
import handleIndexDataApi from "../Controllers/IndexAPi.js";
import handleChartDataApi from "../Controllers/chartApi.js";
import handleDailyReport from "../Controllers/dailyReport.js";

const router=express.Router();

router.get("/trending",handleTrendingApi);

router.get("/mutualfunds",handleMutualfundApi);

router.get("/ipo",handleIpoApi);

router.get("/nse",handleNseApi);

router.get("/bse",handleBseApi);

router.get("/stock/:name",handleStockApi);

router.get("/index/:name",handleIndexDataApi);

router.get("/chart",handleChartDataApi);

router.get("/send_daily_report",handleDailyReport);

export default router;
