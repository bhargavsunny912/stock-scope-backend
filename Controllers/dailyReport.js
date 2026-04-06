import dotenv from "dotenv";
import User from "../Models/userModel.js";
import sendDailyReports from "../Services/sendDailyReports.js";
import getStockData from "../Services/getStockData.js";

dotenv.config({ quiet: true });

const handleDailyReport = async (req, res) => {
  try {
    const secret =
      req.headers["x-cron-secret"] ||
      req.headers["x_cron_secret"];

    if (secret !== process.env.CRON_SECRET) {
      return res.status(401).send("Unauthorized");
    }

    console.log(" Cron job triggered");

    const users = await User.find();

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found to send daily reports",
      });
    }

    const stockData = await getStockData();

    await sendDailyReports(users, stockData);

    console.log(" Daily reports sent successfully");

    res.status(200).json({
      message: "Daily reports sent to users successfully",
    });

  } catch (error) {
    console.error(" Error in daily report cron job", error);

    res.status(500).json({
      message: "Error in daily report cron job",
    });
  }
};

export default handleDailyReport;