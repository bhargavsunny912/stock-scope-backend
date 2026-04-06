import transporter, { sendDailyReportOptions } from "../Configs/nodeMailer.js";

const sendDailyReports=async(users,data)=>{
    const emails=users.map((user)=>{
        return transporter.sendMail(sendDailyReportOptions(user.username,user.email,data),(error,info)=>{
            if(error){
                console.error("Failed to send report emails to users",error);
            }
        });
    });

    await Promise.all(emails);
}
export default sendDailyReports;