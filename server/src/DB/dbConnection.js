import mongoose from "mongoose";

export async function connectToDatabase() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ DB CONNECTED:", connection.connection.name);
  } catch (error) {
    console.error("❌ DB CONNECTION ERROR:", error);
    process.exit(1); // Exit if it fails to connect
  }
}
