import mongoose from "mongoose";

const connectionDB =async ()=> {
    try {
        const URI = "mongodb+srv://elsayedatef469_db_user:lPBnpypf0aY8HV74@cluster0.c3vdkhj.mongodb.net/saraha_app";
       const result = await mongoose.connect(URI, {
          serverSelectionTimeoutMS: 30000,
        });
        console.log("model = ", result.modelNames());
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectionDB;