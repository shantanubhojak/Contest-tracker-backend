// require("dotenv").config();
// const nodemailer = require("nodemailer");
// const cron = require("node-cron");

// let scheduledTasks = {}; // Store scheduled tasks by unique ID

// const scheduleEmailReminder = (req, res) => {
//   const { email, contestName, reminderTime } = req.body;

//   if (!email || !contestName || !reminderTime) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const reminderDate = new Date(reminderTime);
//   if (isNaN(reminderDate.getTime())) {
//     return res.status(400).json({ message: "Invalid reminder time" });
//   }

//   // Create a unique ID for this reminder
//   const reminderId = `${email}-${contestName}-${reminderTime}`;

//   // Convert reminderTime to cron format (UTC)
//   const cronTime = `${reminderDate.getUTCMinutes()} ${reminderDate.getUTCHours()} ${reminderDate.getUTCDate()} ${reminderDate.getUTCMonth() + 1} *`;

//   if (scheduledTasks[reminderId]) {
//     return res.status(400).json({ message: "Reminder already scheduled" });
//   }

//   scheduledTasks[reminderId] = cron.schedule(cronTime, () => {
//     sendEmailReminder(email, contestName);
//     delete scheduledTasks[reminderId]; // Remove task after execution
//   });

//   return res.status(200).json({ message: "Reminder scheduled successfully" });
// };

// const sendEmailReminder = async (email, contestName) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: `Reminder: ${contestName} is starting soon!`,
//       text: `Your contest "${contestName}" is about to start. Get ready!`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Reminder email sent to ${email}`);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// module.exports = { scheduleEmailReminder };

require("dotenv").config();
const nodemailer = require("nodemailer");

const scheduleEmailReminder = async (req, res) => {
  const { email, contestName, contestUrl } = req.body;

  if (!email || !contestName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${contestName} is starting soon!`,
      text: `📢 Reminder: Your contest "${contestName} is about to begin! 🎯
            📅 Stay prepared and give it your best shot!
            🔗 Click here to view the contest: ${contestUrl} 🚀`,
    };

    // console.log("contesturl", contestUrl)
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email}`);

    return res
      .status(200)
      .json({ message: "Reminder email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
};

module.exports = { scheduleEmailReminder };
