// import mongoose from "mongoose";
// let DB_URL = "mongodb://localhost:27017/db-connection"


//  async function connectToDatabase()
// {
//     try
//     {
//         let connection = await mongoose.connect(DB_URL)
//         console.log("DB CONNECTED",connection.connection.name)
//     }
//         catch(error)
//         {
//             console.log(error)
//         }
//     }


// export {connectToDatabase} 
import mongoose from "mongoose";

const DB_URL = "mongodb://127.0.0.1:27017/db-connection";

async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("DB CONNECTED:", mongoose.connection.name);

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose disconnected from DB");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
}

export { connectToDatabase };
