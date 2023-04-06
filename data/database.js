import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "WinWin",
    });
    console.log(
      `Server connected to database ${connection.host}`.green.bgWhite
    );
  } catch (error) {
    console.log("Some Error Occurred", error);
    process.exit(1);
  }
};
