import mongoose from "mongoose";
let DB_URL = "mongodb://localhost:27017/db-connection"


 async function connectToDatabase()
{
    try
    {
        let connection = await mongoose.connect(DB_URL)
        console.log("DB CONNECTED",connection.connection.name)
    }
        catch(error)
        {
            console.log(error)
        }
    }

export {connectToDatabase} 