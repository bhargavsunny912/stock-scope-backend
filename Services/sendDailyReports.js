import sgMail, { sendDailyReportOptions } from "../Configs/sendGrid.js";

const sendDailyReports = async (users, data) => {
  try {
    const messages = users.map((user) =>
      sendDailyReportOptions(user.username, user.email, data)
    );

    await sgMail.send(messages);

    console.log("Emails sent successfully via SendGrid");
  } catch (error) {
    console.error(
      " Failed to send report emails",
      error.response?.body || error
    );
    throw error;
  }
};

export default sendDailyReports;