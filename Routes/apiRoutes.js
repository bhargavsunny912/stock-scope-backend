import express from "express";
import {handleTrendingApi, handleMutualfundApi, handleIpoApi, handleNseApi, handleBseApi, handleStockApi} from "../Controllers/customFetchApi.js";
import handleIndexDataApi from "../Controllers/IndexAPi.js";
import handleChartDataApi from "../Controllers/chartApi.js";

const router=express.Router();

router.get("/trending",handleTrendingApi);

router.get("/mutualfunds",handleMutualfundApi);

router.get("/ipo",handleIpoApi);

router.get("/nse",handleNseApi);

router.get("/bse",handleBseApi);

router.get("/stock/:name",handleStockApi);

router.get("/index/:name",handleIndexDataApi);

router.get("/chart",handleChartDataApi);

export default router;
